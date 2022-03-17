const proxy = require('koa-better-http-proxy');
const koaStaticCache = require('koa-static-cache');
const Koa = require('koa');
const _ = require('lodash');
const path = require('path');
const minimatch = require("minimatch")
const proxyConfig = require('./config.js');
const app = new Koa();

function filter(ctx){
    const url = ctx.request.originalUrl.toLocaleLowerCase();
    console.log(url);
    const rules = proxyConfig.filterReq;
    for(let rule of rules){
        if( _.isString(rule)  ) {
            if (minimatch(url, rule, {matchBase: true})) {
                return false;
            }
        }
        else if( _.isFunction(rule)){
            return !rule(url)
        }

    }
    return true;
}

function filterRes(ctx, res){
    const url = ctx.request.originalUrl.toLocaleLowerCase();
    const filters = proxyConfig.filterRes;
    for(let filter of filters){
        const status = filter.enable ?? true;
        if(status ) {
            for (let rule of filter.rules) {
                if (_.isString(rule)) {
                    if (minimatch(url, rule, {matchBase: true})) {
                        return filter.filter(res);
                    }
                } else if (_.isFunction(rule)) {
                    if (rule(url)) {
                        return filter.filter(res);
                    }
                }
            }
        }
    }
    return res;
}

const headers = proxyConfig.headers;
app.use(proxy(proxyConfig.host,
    {
        headers: headers,
        filter: ctx=>{
            return filter(ctx);
        },
        userResDecorator: (proxyRes,proxyResData,  ctx)=>{
            return filterRes(ctx, proxyResData);
        }
    }
    )).use(koaStaticCache(path.join(__dirname, 'html'), {
    maxAge: 60 * 60,
}));

app.listen(80);

