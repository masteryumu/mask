#!/usr/env python3
# -*- coding: UTF-8 -*-

from flask import Flask, request, send_file, make_response
from flask_cors import CORS
import json
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://yiyan.baidu.com"}})

@app.route("/search_mask", methods=['POST'])
async def search_mask():
    words = request.json.get('words')
    if not words:
        return jsonify({'error': 'Missing words parameter'}), 400
    prompt = "利用中文名字（words）查找对应的角色是否有在京剧中的脸谱，要求如下：1.如果没有，则输出“没有找到相应的脸谱，换一个试试吧”，2.如果有，则首先输出“脸谱存在”，其次换行之后输出对应角色不少于严格两百字的详细的真实的简介，特别注意字数不能少于两百字。然后列举几个出现这个角色脸谱的京剧，特别注意需要尽可能多的列出而且要真实，严格按照例子“脸谱出处：《三国演义》”的形式在一个独立的行内输出。最后换行并且列出几个用户能够了解其的纪录片，特别注意需要尽可能多的列出而且要真实，严格按照例子“参考了解资料：《戏剧鉴赏》”的形式在一个独立的行内输出" 
    # API返回字段"prompt"有特殊含义：开发者可以通过调试它来调试输出效果
    return make_response({"words": words, "prompt": prompt})


@app.route("/logo.png")
async def plugin_logo():
    """
        注册用的：返回插件的logo，要求48 x 48大小的png文件.
        注意：API路由是固定的，事先约定的。
    """
    return send_file('logo.png', mimetype='image/png')


@app.route("/.well-known/ai-plugin.json")
async def plugin_manifest():
    """
        注册用的：返回插件的描述文件，描述了插件是什么等信息。
        注意：API路由是固定的，事先约定的。
    """
    host = request.host_url
    with open(".well-known/ai-plugin.json", encoding="utf-8") as f:
        text = f.read().replace("PLUGIN_HOST", host)
        return text, 200, {"Content-Type": "application/json"}


@app.route("/.well-known/openapi.yaml")
async def openapi_spec():
    """
        注册用的：返回插件所依赖的插件服务的API接口描述，参照openapi规范编写。
        注意：API路由是固定的，事先约定的。
    """
    with open(".well-known/openapi.yaml", encoding="utf-8") as f:
        text = f.read()
        return text, 200, {"Content-Type": "text/yaml"}




@app.route('/')
def index():
    return 'welcome to my webpage!'

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=8081)