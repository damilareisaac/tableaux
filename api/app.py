import io
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS


from config import Config
from dataInjector import (
    prep_data,
    get_grid_columns,
    get_summary_columns,
    get_grid_rows,
    get_categorical_summary,
    get_summarised_data,
)

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, resources={r"*": {"origins": "http://localhost:3000"}})


@app.route("/upload", methods=["POST"])
def create_upload_file():
    print(request)
    try:
        contents = request.files["file"].read()
        df = pd.read_csv(
            io.StringIO(contents.decode("utf-8")),
            keep_default_na=False,
        )
        df = prep_data(df)
        df.to_csv("data.csv", index=False)
        df_cat = pd.DataFrame(df.select_dtypes(include=["object"]))
        measures = df.select_dtypes(
            include=["int", "float"],
        ).columns.tolist()
        categories = df_cat.columns.tolist()
        return {
            "data_columns": get_grid_columns(df.columns),
            "numeric_summary_columns": get_summary_columns(
                df.describe().columns,
            ),
            "cat_summary_columns": get_summary_columns(
                df_cat.describe().columns,
            ),
            "data_rows": get_grid_rows(df),
            "numeric_summary_rows": get_categorical_summary(df),
            "cat_summary_rows": get_categorical_summary(df_cat),
            "measures": measures,
            "categories": categories,
        }
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 404


@app.route("/report_query", methods=["GET"])
def get_report_query():
    df = pd.read_csv("data.csv")
    categories = df.select_dtypes(
        include=["object"],
    ).columns.tolist()
    measures = df.select_dtypes(
        include=["int", "float"],
    ).columns.tolist()
    default_chart = get_summarised_data(
        categories[0],
        measures[0],
        "sum",
    )
    return {**default_chart, "categories": categories, "measures": measures}


@app.route("/update_chart_element", methods=["GET"])
def update_chart_element():
    x = request.args.get("x")
    y = request.args.get("y")
    aggregator = request.args.get("aggregator")
    try:
        return get_summarised_data(x, y, aggregator)
    except Exception as e:
        return jsonify({"error": str(e)}), 404


if __name__ == "__main__":
    app.run()
