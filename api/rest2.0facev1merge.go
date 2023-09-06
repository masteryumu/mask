package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "strings"
)
const API_KEY = "RRygZS6wpLH5otPzhao5CZyr"
const SECRET_KEY = "WOLWNtSo5SDHCW92Ds4IV0ijZ6CD5P9G"

func main() {

    url := "https://aip.baidubce.com/rest/2.0/face/v1/merge?access_token=" + GetAccessToken()
    payload := strings.NewReader(`{"image_target":{"image":"[填写目标图URL:目标图信息 图片的分辨率要求在1920x1080以下]","image_type":"URL","quality_control":"NONE"},"image_template":{"image":"[填写参考图URL:模板图信息 图片的分辨率要求在1920x1080以下]","image_type":"URL"},"version":"2.0[(Required) 服务版本 ，可选（1.0,2.0,3.0,4.0），如不传入该项则默认调用（1.0），2.0/3.0/4.0对merge_degree不生效，对融合效果要求较高可选择2.0（推荐版本），对融合结果的清晰度要求较高可选择3.0，4.0为最新版本，清晰度及融合效果均有提升，页面功能演示为2.0版本效果]","alpha":"[融合参数，可选范围 0-1浮点数,保留两位小数，默认(0), 只在version=4.0时才有效]","merge_degree":"[融合度 关系到融合图与目标图的相似度 越高则越相似LOW:较低的融合度NORMAL: 一般的融合度HIGH: 较高的融合度COMPLETE: 完全融合，其效果类似于换脸默认COMPLETE]"}`)
    client := &http.Client {}
    req, err := http.NewRequest("POST", url, payload)

    if err != nil {
        fmt.Println(err)
        return
    }
    req.Header.Add("Content-Type", "application/json")

    res, err := client.Do(req)
    if err != nil {
        fmt.Println(err)
        return
    }
    defer res.Body.Close()

    body, err := ioutil.ReadAll(res.Body)
    if err != nil {
        fmt.Println(err)
        return
    }
    fmt.Println(string(body))
}

/**
 * 使用 AK，SK 生成鉴权签名（Access Token）
 * @return string 鉴权签名信息（Access Token）
 */
func GetAccessToken() string {
    url := "https://aip.baidubce.com/oauth/2.0/token"
    postData := fmt.Sprintf("grant_type=client_credentials&client_id=%s&client_secret=%s", API_KEY, SECRET_KEY)
    resp, err := http.Post(url, "application/x-www-form-urlencoded", strings.NewReader(postData))
    if err != nil {
        fmt.Println(err)
        return ""
    }
    defer resp.Body.Close()
    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        fmt.Println(err)
        return ""
    }
    accessTokenObj := map[string]string{}
    json.Unmarshal([]byte(body), &accessTokenObj)
    return accessTokenObj["access_token"]
}  
