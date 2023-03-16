import pandas as pd
import numpy as np


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


def get_summarised_data(
    x,
    y,
    aggregator,
):
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
