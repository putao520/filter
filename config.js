const cache = require('./cache').build();
module.exports = {
    host: "www.baidu.com",
    headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_1_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/16D57 MicroMessenger/7.0.3(0x17000321) NetType/WIFI Language/zh_CN'
    },
    filterReq: [
        'injected.js',
        '*.txt',
    ],
    filterRes: [
        {
            // 匹配规则
            rules: [
                '*.+(html|htm)',
                (url)=>{
                return url.indexOf('.') === -1;
                }
            ],
            // 过滤内容/替换内容
            filter: (res) => {
                let r = cache.get('index.html');
                if( r === undefined){
                    const html = res.toString();
                    const result = html.replace(/<\/body>/i, '<script src="../injected.js"></script>\n</body>');
                    r = Buffer.from(result);
                    cache.set('index.html', r);
                }
                return r;
            }
        },
        {
            enable: false,
            rules:[
                'index.*.js'
            ],
            filter: res => {
                let r = cache.get('index.?.js');
                if( r === undefined) {
                    const script = res.toString();
                    const newScript = script.replace(/www\.baidu\.com/g, "127.0.0.1:3000");
                    r = Buffer.from(newScript);
                    cache.set('index.?.js', r);
                }
                return r;
            }
        }
    ]
}

