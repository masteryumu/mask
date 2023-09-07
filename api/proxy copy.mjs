import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/getAccessToken', async (req, res) => {
  try {
    const AK = "RRygZS6wpLH5otPzhao5CZyr";
    const SK = "WOLWNtSo5SDHCW92Ds4IV0ijZ6CD5P9G";
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`;

    const response = await axios.get(url);
    const data = response.data;

    res.json({ access_token: data.access_token });
  } catch (error) {
    res.status(500).json({ error: '获取Access Token失败' });
  }
});

app.post('/mergeImages', async (req, res) => {
  try {
    const requestBody = req.body;

    const image_target = {
      image: requestBody.image_target,
      image_type: "URL",
      quality_control: "NONE"
    };

    const image_template = {
      image: requestBody.image_template,
      image_type: "URL"
    };

    const version = "2.0";

    // 调用performImageMerge函数执行图像合成操作，并获取百度API的响应数据
    const response = await performImageMerge(image_target, image_template, version);

    // 返回图像合成的结果
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: '图像合成失败' });
  }
});

async function performImageMerge(imageTarget, imageTemplate, version) {
  try {
    // 在这里执行图像合成操作，调用百度AI服务或其他图像处理库
    // 这里需要根据你的具体需求编写代码，将imageTarget和imageTemplate合成并返回结果

    // 示例：这里假设你调用了某个图像合成 API，并将结果保存在 response 中
    const response = await callSomeImageMergeAPI(imageTarget, imageTemplate, version);

    // 处理百度API的响应数据，这取决于你调用的API和返回的数据格式
    // 以下是一个示例，你可以根据实际情况修改它
    const result = {
      error_code: response.error_code,
      error_msg: response.error_msg,
      // 其他合成后的数据
    };

    return result;
  } catch (error) {
    // 处理图像合成失败的情况
    throw new Error('图像合成失败: ' + error.message);
  }
}

// 在这里编写调用实际图像合成 API 的代码，将imageTarget和imageTemplate合成并返回结果

app.listen(port, () => {
  console.log(`代理服务器已启动，监听端口 ${port}`);
});
