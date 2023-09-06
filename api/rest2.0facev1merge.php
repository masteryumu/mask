<?php
class Sample {
    const API_KEY = "RRygZS6wpLH5otPzhao5CZyr";
    const SECRET_KEY = "WOLWNtSo5SDHCW92Ds4IV0ijZ6CD5P9G";

    public function run() {
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://aip.baidubce.com/rest/2.0/face/v1/merge?access_token={$this->getAccessToken()}",
            CURLOPT_TIMEOUT => 30,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_SSL_VERIFYPEER  => false,
            CURLOPT_SSL_VERIFYHOST  => false,
            CURLOPT_CUSTOMREQUEST => 'POST',
            
            CURLOPT_POSTFIELDS =>'{"image_target":{"image":"[填写目标图URL:目标图信息 图片的分辨率要求在1920x1080以下]","image_type":"URL","quality_control":"NONE"},"image_template":{"image":"[填写参考图URL:模板图信息 图片的分辨率要求在1920x1080以下]","image_type":"URL"},"version":"2.0[(Required) 服务版本 ，可选（1.0,2.0,3.0,4.0），如不传入该项则默认调用（1.0），2.0/3.0/4.0对merge_degree不生效，对融合效果要求较高可选择2.0（推荐版本），对融合结果的清晰度要求较高可选择3.0，4.0为最新版本，清晰度及融合效果均有提升，页面功能演示为2.0版本效果]","alpha":"[融合参数，可选范围 0-1浮点数,保留两位小数，默认(0), 只在version=4.0时才有效]","merge_degree":"[融合度 关系到融合图与目标图的相似度 越高则越相似LOW:较低的融合度NORMAL: 一般的融合度HIGH: 较高的融合度COMPLETE: 完全融合，其效果类似于换脸默认COMPLETE]"}',
    
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json'
            ),

        ));
        $response = curl_exec($curl);
        curl_close($curl);
        return $response;
    }
    
    /**
     * 使用 AK，SK 生成鉴权签名（Access Token）
     * @return string 鉴权签名信息（Access Token）
     */
    private function getAccessToken(){
        $curl = curl_init();
        $postData = array(
            'grant_type' => 'client_credentials',
            'client_id' => self::API_KEY,
            'client_secret' => self::SECRET_KEY
        );
        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://aip.baidubce.com/oauth/2.0/token',
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_SSL_VERIFYPEER  => false,
            CURLOPT_SSL_VERIFYHOST  => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS => http_build_query($postData)
        ));
        $response = curl_exec($curl);
        curl_close($curl);
        $rtn = json_decode($response);
        return $rtn->access_token;
    }
}

$rtn = (new Sample())->run();
print_r($rtn);