const request = require('request')
const AK = "RRygZS6wpLH5otPzhao5CZyr"
const SK = "WOLWNtSo5SDHCW92Ds4IV0ijZ6CD5P9G"

async function main() {
    var options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/rest/2.0/face/v1/merge?access_token=' + await getAccessToken(),
        'headers': {
                'Content-Type': 'application/json'
        },
        body: JSON.stringify({
                "image_target": {
                        "image": "1.png" ,
                        "image_type": "URL",
                        "quality_control": "NONE"
                },
                "image_template": {
                        "image": "2.png" ,
                        "image_type": "URL"
                },
                "version": "2.0",
                // "alpha": "[融合参数，可选范围 0-1浮点数,保留两位小数，默认(0), 只在version=4.0时才有效]",
                // "merge_degree": "[融合度 关系到融合图与目标图的相似度 越高则越相似LOW:较低的融合度NORMAL: 一般的融合度HIGH: 较高的融合度COMPLETE: 完全融合，其效果类似于换脸默认COMPLETE]"
        })

    };

    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
}

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
function getAccessToken() {

    let options = {
        'method': 'POST',
        'url': 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + AK + '&client_secret=' + SK,
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response) => {
            if (error) { reject(error) }
            else { resolve(JSON.parse(response.body).access_token) }
        })
    })
}
main();
