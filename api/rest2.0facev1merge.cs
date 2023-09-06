using System;
using System.IO;
using RestSharp;//依赖版本106.15.0 https://www.nuget.org/packages/RestSharp/106.15.0
using Newtonsoft.Json; //https://www.nuget.org/packages/Newtonsoft.Json
namespace SampleApplication {
    public class Sample {

        const string API_KEY = "RRygZS6wpLH5otPzhao5CZyr";
        const string SECRET_KEY = "WOLWNtSo5SDHCW92Ds4IV0ijZ6CD5P9G";

        public static void Main(string[] args) {
            var client = new RestClient($"https://aip.baidubce.com/rest/2.0/face/v1/merge?access_token={GetAccessToken()}");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/json");
            var body = @"{""image_target"":{""image"":""[填写目标图URL:目标图信息 图片的分辨率要求在1920x1080以下]"",""image_type"":""URL"",""quality_control"":""NONE""},""image_template"":{""image"":""[填写参考图URL:模板图信息 图片的分辨率要求在1920x1080以下]"",""image_type"":""URL""},""version"":""2.0[(Required) 服务版本 ，可选（1.0,2.0,3.0,4.0），如不传入该项则默认调用（1.0），2.0/3.0/4.0对merge_degree不生效，对融合效果要求较高可选择2.0（推荐版本），对融合结果的清晰度要求较高可选择3.0，4.0为最新版本，清晰度及融合效果均有提升，页面功能演示为2.0版本效果]"",""alpha"":""[融合参数，可选范围 0-1浮点数,保留两位小数，默认(0), 只在version=4.0时才有效]"",""merge_degree"":""[融合度 关系到融合图与目标图的相似度 越高则越相似LOW:较低的融合度NORMAL: 一般的融合度HIGH: 较高的融合度COMPLETE: 完全融合，其效果类似于换脸默认COMPLETE]""}";
            request.AddParameter("application/json", body,  ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);
            Console.WriteLine(response.Content);

        }
        
        
        /**
        * 使用 AK，SK 生成鉴权签名（Access Token）
        * @return 鉴权签名信息（Access Token）
        */
        static string GetAccessToken() {
            var client = new RestClient($"https://aip.baidubce.com/oauth/2.0/token");
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddParameter("grant_type", "client_credentials");
            request.AddParameter("client_id", API_KEY);
            request.AddParameter("client_secret", SECRET_KEY);
            IRestResponse response = client.Execute(request);
            Console.WriteLine(response.Content);
            var result = JsonConvert.DeserializeObject<dynamic>(response.Content);
            return result.access_token.ToString();
        }
        
    }
}
