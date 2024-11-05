import os

from flask import Flask, render_template, request, jsonify
from langchain_community.chat_models import QianfanChatEndpoint
from langchain_core.messages import HumanMessage

app = Flask(__name__)

os.environ["QIANFAN_AK"] = "vmKE31AvbYJUOvj2mQZU9B9l"
os.environ["QIANFAN_SK"] = "XFapeeYRiJiA0PNsiagPqYlh9jNd2ypI"

chat = QianfanChatEndpoint(
    streaming=True,
    language='en',
)
# res = chat([HumanMessage(content="阿拉斯加位于哪个洲")])
# print(res.content)

@app.route('/')
def index():

    return render_template('welcome.html')

# 处理从前端发送过来的输入信息
@app.route('/process_input', methods=['POST'])
def process_input():
    data = request.get_json()
    input_text = data.get('text')

    # 后端处理逻辑
    res = chat([HumanMessage(content=input_text)])

    # 将处理结果返回到前端
    return jsonify({'response': res.content})


if __name__ == '__main__':
    app.run(debug=True)