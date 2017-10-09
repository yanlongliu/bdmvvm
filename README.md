个人MVVM轮子
=================
声明：此框架是自己造的轮子，切勿用在生产环境！

#### 模块列表 

| 模块 | 描述 |
|---------|-------------|
| [scope]               | mvvm状态管理模块 |
| [parse]        | 解释器模块 |
| [module&inject]         | 模块以及依赖注入管理 |
| [Utils]    | 工具集 |
| [directive]    | 指令模块 |

目录结构
-------------------

* scope

    * scope以及脏检查

    * scope方法

    * scope继承

    * collection观察

    * scope事件  
    
* 解释器

    * 解释性语言

    * 词表达式

    * 方法调用表达式

    * 操作表达式

    * 过滤器  
    
    * 观察表达式

* 模块和依赖注入  

    * 模块和注入  
    
    * providers  
    
    * 高级别的依赖注入  
  
* 工具集  

    * promise  
    
    * http  

* 指令  

    * dom编译和基础指令  
    
    * 属性指令  
    
    * 指令的链接和scope  
    
    * 控制器  
    
    * 指令中的模板  
    
    * 嵌入包含  
    
    * 改写  
    
    * 组件  
    
    * Bootstrapping  
    


****
### webpack配置
`用的是脚手架的默认配置，项目暂时无需特殊配置。`

### server配置
* 路由  

```javascript
var isMock = process.env.isMock;
router.get('/get-pagelist', function(req, res, next) {
    fs.readFile(__dirname + '/../usermock/abtest/testLists.json', 'utf8', (err, data) => {
        res.json(JSON.parse(data));
    });
});
```
* mockData模拟数据

![image](http://git.daojia-inc.com/liuyanlong/shutterstock/raw/f316888e1b47a1122feff55c75f88764bf238a81/234.png)






