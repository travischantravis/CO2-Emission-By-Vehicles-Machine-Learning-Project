from flask import Flask, request, jsonify, make_response, url_for
import pandas as pd
import os
import numpy as np
from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from random import randint
from random import seed

app = Flask(__name__)

# read in data and create model
with open(os.path.abspath(os.path.dirname(__file__)) + '/CO2_Emissions_Canada.csv') as csvfile:
    df = pd.read_csv(csvfile)
csvfile.close()

le = LabelEncoder()

# encode all columns
make_ = le.fit_transform(df.Make)
model_ = le.fit_transform(df.Model)
class_ = le.fit_transform(df["Vehicle Class"])
size_ = le.fit_transform(df["Engine Size(L)"])
cylinder_ = le.fit_transform(df.Cylinders)
trans_ = le.fit_transform(df.Transmission)
fuel_ = le.fit_transform(df["Fuel Type"])

df_car_ = df.copy()

# re-insert encoded data into the dataset
df_car_["Make"] = make_
df_car_["Model"] = model_
df_car_["Vehicle Class"] = class_
df_car_["Engine Size(L)"] = size_
df_car_["Cylinders"] = cylinder_
df_car_["Transmission"] = trans_
df_car_["Fuel Type"] = fuel_

X_dat = np.asarray(df_car_.copy().drop(columns = ['CO2 Emissions(g/km)']))
y_dat = np.asarray(df_car_['CO2 Emissions(g/km)'])

poly = PolynomialFeatures(degree=3, include_bias=False)
poly_features = poly.fit_transform(X_dat)
X_train, X_test, y_train, y_test = train_test_split(poly_features, y_dat, test_size=0.2, random_state=42)
poly_reg_model = LinearRegression()
poly_reg_model.fit(X_train, y_train)

def PolynomialModel(s):
    seed(s)
    value = randint(0, 1476)
    
    if(value != 0):
        fract = 1/value
    else:
        fract = 1
    
    X_data_orig = np.asarray(df.copy().drop(columns = ['CO2 Emissions(g/km)']))
    X_train_discard, X_test_orig, y_train_discard, y_test_discard = train_test_split(X_data_orig, y_dat, test_size=0.2, random_state=42)
    discard, orig_input = train_test_split(X_test_orig, test_size=fract, random_state=42)

    discard, user_input = train_test_split(X_test, test_size=fract, random_state=42)
    poly_reg_y_predicted = poly_reg_model.predict(user_input)

    return orig_input, poly_reg_y_predicted


@app.route('/', methods=['POST', 'OPTIONS'])
def json_example():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add('Access-Control-Allow-Headers', "*")
        response.headers.add('Access-Control-Allow-Methods', "*")
        response.headers.add("Access-Control-Allow-Credentials", "*")
        return response
    request_data = request.get_json()
    
    s = int(request_data['cars'])
    thresh = int(request_data['threshold'])

    input_s, cars = PolynomialModel(s)
    
    final=[]
    i = 0
    for car in cars:
        if car <= thresh:
            cur = [input_s[:, :2][i], cars[i]]
            final.append([cur[0][0], cur[0][1], cur[1]])
        i += 1

    response = make_response(jsonify(
        cars=final,
    ), 200)
    response.headers.add('Access-Control-Allow-Origin', "*")
    return response
