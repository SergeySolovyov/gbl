# -*- coding: utf-8 -*-
from flask import Flask, request, send_file
import requests
from flask_cors import CORS
import random
import json

import cv2, os
app = Flask(__name__)

@app.route("/rrr", methods=['GET', 'POST'])
def hello():
	res = "ok"
	query_string = request.query_string
	newHeaders = {'Content-type': 'text/plain'}
	url = 'http://bgl_user:12345678@161.35.123.34:8332'
	myobj = {"jsonrpc": "1.0", "id":"curltest", "method": "sendrawtransaction", "params": [query_string.replace('trx=','')]}
	#myobj = {"jsonrpc":"1.0","id":"curltext","method":"sendrawtransaction","params":["020000000001017bd805119d850f59fefdde7cb1e43d9b859fdb2a8caf10b61b8cae51d2203a950100000000ffffffff0218ddf5050000000016001436e5c8d36c143fef95ddcf961344b6e60f4afad400e9a43500000000160014010d9b93c80b27f7a708db81be5206951918cd340247304402207ea4c3b56dd455052d5ecf9159118a0f770fab8c48ba8f5ca591c4fce6f02c15022078729fe06ec16e3d8c1de917dae4c8466bfd5c38d6563e3dd2dd8cfd1b5e1e7001210203f73cc4a229d1fd7fed0961beae93a32c90a37d81a2450a83385af41909b5e1937f0000"]}
	x = requests.post(url, data = json.dumps(myobj), headers=newHeaders)
	json.loads(x.text)
	print(x.text)
	if json.loads(x.text)[u'error']:
		res = "fail"
	else:
		res = "ok"
	return res
@app.route("/info", methods=['GET', 'POST'])
def info():
	query_string = request.query_string
	newHeaders = {'Content-type': 'text/plain'}
	url = 'http://bgl_user:12345678@161.35.123.34:8332'
	myobj = {"jsonrpc": "1.0", "id":"curltest", "method": "getrawtransaction", "params": [query_string.replace('trx=',''), True]}
	#myobj = {"jsonrpc":"1.0","id":"curltext","method":"sendrawtransaction","params":["020000000001017bd805119d850f59fefdde7cb1e43d9b859fdb2a8caf10b61b8cae51d2203a950100000000ffffffff0218ddf5050000000016001436e5c8d36c143fef95ddcf961344b6e60f4afad400e9a43500000000160014010d9b93c80b27f7a708db81be5206951918cd340247304402207ea4c3b56dd455052d5ecf9159118a0f770fab8c48ba8f5ca591c4fce6f02c15022078729fe06ec16e3d8c1de917dae4c8466bfd5c38d6563e3dd2dd8cfd1b5e1e7001210203f73cc4a229d1fd7fed0961beae93a32c90a37d81a2450a83385af41909b5e1937f0000"]}
	x = requests.post(url, data = json.dumps(myobj), headers=newHeaders)
	res = json.loads(x.text)
	print(res[u'result'].keys)
	if res[u'result'].has_key(u'confirmations'):
		conf = res[u'result'][u'confirmations']
	else:
		conf = 0
	return str(conf)
if __name__ == "__main__":
	app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
	CORS(app)
	app.run()