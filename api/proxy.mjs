import express from 'express';
import axios from 'axios';
import cors from 'cors';
import bodyParser from 'body-parser'; // 引入body-parser模块

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json()); // 使用body-parser来解析JSON请求体

// 在代理服务器代码中添加这行，将静态文件目录设置为存放图像的目录
app.use(express.static('E:/Desktop/mask/api'));


// 处理根路径的请求
app.get('/', (req, res) => {
  res.send('Hello World');
});

// 获取百度AI的Access Token
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

// 处理图像合成请求
app.post('/mergeImages', async (req, res) => {
  try {
    const requestBody = req.body; // 获取请求体作为 JSON 对象

    // 现在，你可以从请求体中获取 base64 图像数据
    const base64ImageTarget = requestBody.image_target;
    const base64ImageTemplate = requestBody.image_template;

    // 在这里设置图像合成的参数
    const image_target = {
      image: base64ImageTarget,
      image_type: "BASE64",
      quality_control: "NONE"
    };
    
    const image_template = {
      image: base64ImageTemplate,
      image_type: "BASE64"
    };

    const version = "2.0";

    // 在这里使用设置的参数进行图像合成操作，例如调用相应的图像合成 API
    // 示例：这里假设你调用了某个图像合成 API，并将结果保存在 response 中
    const response = await performImageMerge(image_target, image_template, version);

    // 返回图像合成的结果
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: '图像合成失败' });
  }
});

app.listen(port, () => {
  console.log(`代理服务器已启动，监听端口 ${port}`);
});
