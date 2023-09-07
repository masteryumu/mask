我现在的代理服务器的代码是：
import express from 'express';
import axios from 'axios';
import cors from 'cors'; // 引入cors模块

const app = express();
const port = 3000;

// 使用cors中间件，允许所有源访问代理服务器
app.use(cors());

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

    // 在这里设置图像合成的参数
    const image_target = {
      image: "1.png",
      image_type: "URL",
      quality_control: "NONE"
    };
    
    const image_template = {
      image: "2.png",
      image_type: "URL"
    };

        const version = "2.0";
        // 添加其他参数如 alpha 和 merge_degree，如果需要

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
前端的代码是：
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>图像合成</title>
</head>

<body>
    <button onclick="mergeImages()">点击合成</button>
    <script>
        // 修改为你的代理服务器地址
        const PROXY_SERVER_URL = 'http://localhost:3000'; // 根据你的实际情况修改

        // 常量定义
        const TARGET_IMAGE_URL = "1.png"; // 本地图像文件，请确保与HTML文件位于同一目录下
        const TEMPLATE_IMAGE_URL = "2.png"; // 本地图像文件，请确保与HTML文件位于同一目录下

        // 发送获取 Access Token 请求到代理服务器
        async function getAccessToken() {
            try {
                const response = await fetch(`${PROXY_SERVER_URL}/getAccessToken`);
                const data = await response.json();
                return data.access_token;
            } catch (error) {
                throw new Error('获取 Access Token 失败');
            }
        }

        // 发送图像合成请求到代理服务器
        async function sendMergeRequest(accessToken) {
            try {
                const url = `${PROXY_SERVER_URL}/mergeImages?access_token=${accessToken}`;
                const formData = new FormData();
                formData.append('image_target', TARGET_IMAGE_URL);
                formData.append('image_template', TEMPLATE_IMAGE_URL);
                formData.append('image_type', 'URL');
                formData.append('quality_control', 'NONE');
                formData.append('version', '2.0');

                const response = await fetch(url, {
                    method: 'POST',
                    body: formData
                });

                return response.json();
            } catch (error) {
                throw new Error('发送图像合成请求失败');
            }
        }

        // 处理图像合成结果
        function handleMergeResponse(response) {
            console.log(response);
            if (response.error_code === 0) {
                alert('图像合成成功！');
            } else {
                alert('图像合成失败：' + response.error_msg);
            }
        }

        // 合成图像函数
        async function mergeImages() {
            try {
                // 获取 Access Token
                const accessToken = await getAccessToken();

                // 发送合成请求
                const response = await sendMergeRequest(accessToken);

                // 处理合成结果
                handleMergeResponse(response);
            } catch (error) {
                console.error('合成图像时出错：', error);
                alert('图像合成发生错误，请查看控制台以获取更多信息。');
            }
        }
    </script>
</body>

</html>
我现在想将其中的url参数全部改为base64，我该怎么操作