 <p align="center">
  <img src="https://img.shields.io/badge/Avue-1.6.0-green.svg" alt="Build Status">
   <img src="https://img.shields.io/badge/Spring%20Cloud-Greenwich.SR2-blue.svg" alt="Coverage Status">
   <img src="https://img.shields.io/badge/Spring%20Boot-2.1.6.RELEASE-blue.svg" alt="Downloads">
 </p>  
 
**albedo-cloud Microservice Architecture**   
- 前端<a href="https://github.com/somowhere/albedo-ui" target="_blank">albedo-ui </a>
- 基于<a href="https://gitee.com/log4j/pig" target="_blank">pix</a>开源版本（保持更新）二次开发(同时借鉴<a href="https://www.jhipster.tech/" target="_blank">jhipster</a>)
- 基于 Spring Cloud Greenwich.SR2 、Spring Security OAuth2 的RBAC权限管理系统  
- 基于数据驱动视图的理念封装 Element-ui，即使没有 vue 的使用经验也能快速上手  
- 提供对常见容器化支持 Docker、Kubernetes、Rancher2 支持  
- 提供 lambda 、stream api 、webflux 的生产实践   

    

   
![](https://images.gitee.com/uploads/images/2019/0330/065147_85756aea_410595.png)   

#### 核心依赖 


依赖 | 版本
---|---
Spring Boot |  2.1.6.RELEASE  
Spring Cloud | Greenwich.SR2   
Spring Security OAuth2 | 2.3.5
Mybatis Plus | 3.1.2
hutool | 4.5.16
Avue | 1.6.0
   


#### 模块说明
```lua
albedo
├── albedo-ui -- 前端工程[8080]
├── albedo-auth -- 授权服务提供[3000]
└── albedo-common -- 系统公共模块 
     ├── albedo-common-api --  服务基础api
     ├── albedo-common-core -- 公共工具类核心包
     ├── albedo-common-log -- 日志服务
     ├── albedo-common-module -- 模块基础包
     └── albedo-common-security -- 安全工具类
├── albedo-config -- 配置中心[8888]
├── albedo-eureka -- 服务注册与发现[8761]
├── albedo-gateway -- Spring Cloud Gateway网关[9999]
└── albedo-module -- 功能模块
     ├── albedo-sys -- 通用用户权限管理系统业务处理模块[4000]
     ├── albedo-gen -- 图形化代码生成[5003]
     ├── albedo-monitor -- Spring Boot Admin监控 [5001]
     └── albedo-zipkin -- 链路调用监控 [5002]
└── albedo-plugin  -- 插件模块 
     ├── albedo-data-mybatis -- mybatis 基础模块
     └── albedo-swagger-api -- swagger api
	 
```
#### 提交反馈

1. 欢迎提交 issue，请写清楚遇到问题的原因，开发环境，复显步骤。

2. 不接受`功能请求`的 issue，功能请求可能会被直接关闭。  

3. <a href="mailto:somewhere0813@gmail.com">somewhere0813@gmail.com</a>    

4. QQ群: 685728393 

#### 开源协议


![](https://images.gitee.com/uploads/images/2019/0330/065147_e07bc645_410595.png)


#### 关注我们

