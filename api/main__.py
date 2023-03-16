import io
from fastapi import File, HTTPException, UploadFile
import pandas as pd
import numpy as np
from config import app


def column_transform(column):
    return column.replace("_", " ").upper()


def get_grid_columns(columns):
    return [{"field": i, "headerName": column_transform(i)} for i in columns]


def get_summary_columns(columns):
    return [column_transform(i) for i in list(columns)]


def get_grid_rows(df):
    return [{**i, "id": index} for index, i in enumerate(df.to_dict("records"))]


def prep_data(df):
    for col in df.select_dtypes(include=["int", "float"]).columns:
        if len(df[col].unique()) < 20:
            df[col] = df[col].astype("category")
        df["index"] = df.index
    return df


def get_bar_chart(x, y, aggregator):
    print("aggregrator", aggregator)
    df = pd.read_csv("data.csv")
    mapper = {
        "count": df[[x, y]].groupby([x]).count(),
        "sum": df[[x, y]].groupby([x]).sum(),
        "min": df[[x, y]].groupby([x]).min(),
        "max": df[[x, y]].groupby([x]).max(),
        "mean": df[[x, y]].groupby([x]).mean(),
        "median": df[[x, y]].groupby([x]).median(),
    }
    x_y_aggretate = mapper[aggregator]
    categories = x_y_aggretate.index.tolist()
    series = dict(data=[int(i[0]) for i in x_y_aggretate.values])
    return dict(x_axis={"categories": categories}, series=[series])


def get_categorical_summary(df):
    result = []
    summary = df.describe().values.tolist()[1:]
    for el in summary:
        row = []
        for i in el:
            if type(i) == str:
                row.append(i)
            elif type(i) == np.int64 or type(i) == int:
                row.append(int(i))
            elif type(i) == np.float64:
                row.append(float(i))
            else:
                row.append(i)
        result.append(row)
    return result


@app.post("/upload")
async def create_upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        df = pd.read_csv(
            io.StringIO(contents.decode("utf-8")),
            keep_default_na=False,
        )
        df = prep_data(df)
        df.to_csv("data.csv", index=False)
        df_cat = pd.DataFrame(df.select_dtypes(include=["object"]))
        measures = df.select_dtypes(include=["int", "float"]).columns.tolist()
        categories = df_cat.columns.tolist()
        return {
            "data_columns": get_grid_columns(df.columns),
            "numeric_summary_columns": get_summary_columns(df.describe().columns),
            "cat_summary_columns": get_summary_columns(df_cat.describe().columns),
            "data_rows": get_grid_rows(df),
            "numeric_summary_rows": get_categorical_summary(df),
            "cat_summary_rows": get_categorical_summary(df_cat),
            "measures": measures,
            "categories": categories,
        }
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@app.get("/report_query")
async def get_report_query():
    df = pd.read_csv("data.csv")
    categories = df.select_dtypes(include=["object"]).columns.tolist()
    measures = df.select_dtypes(include=["int", "float"]).columns.tolist()
    default_chart = get_bar_chart(categories[0], measures[0], "sum")
    return {**default_chart, "categories": categories, "measures": measures}


@app.get("/update_chart_element")
async def update_chart_element(x: str, y: str, aggregator: str):
    try:
        return get_bar_chart(x, y, aggregator)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
