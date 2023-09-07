import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // 解析请求体为 JSON 格式

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

    // 在这里设置图像合成的参数
    const image_target = {
      image: 'https://img0.baidu.com/it/u=788673368,4264362421&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=463',
      image_type: "URL",
      quality_control: "NONE"
    };
    
    const image_template = {
      image: 'https://img0.baidu.com/it/u=2280817350,814068723&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      image_type: "URL"
    };

    const version = "2.0";

    // 调用图像合成函数并获取结果
    const response = await performImageMerge(image_target, image_template, version);

    // 返回图像合成的结果
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: '图像合成失败' });
  }
});

async function performImageMerge(imageTarget, imageTemplate, version) {
  try {
    // 构建图像合成的请求参数
    const url = 'https://aip.baidubce.com/rest/2.0/face/v1/merge?access_token=' + await getAccessToken();
    
    const requestBody = {
      "image_target": {
        "image": imageTarget.image,
        "image_type": "URL",
        "quality_control": "NONE"
      },
      "image_template": {
        "image": imageTemplate.image,
        "image_type": "URL"
      },
      "version": version
    };

    // 发送图像合成请求并获取响应
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    throw new Error('图像合成失败: ' + error.message);
  }
}

// 获取百度AI的Access Token
async function getAccessToken() {
  try {
    const AK = "RRygZS6wpLH5otPzhao5CZyr";
    const SK = "WOLWNtSo5SDHCW92Ds4IV0ijZ6CD5P9G";
    const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${AK}&client_secret=${SK}`;

    const response = await axios.get(url);
    const data = response.data;

    return data.access_token;
  } catch (error) {
    throw new Error('获取Access Token失败');
  }
}

app.listen(port, () => {
  console.log(`代理服务器已启动，监听端口 ${port}`);
});
