build my own mvvm
简易的mvvm框架。
包含scope、parse、module&inject、util（http、promise）
</br>
scope包括dirty-check、 scope extend、event handle
</br>
parse包括lexer、ASTbuilder、ASTCompiler、mvvm独有的Unix-style-pipe filter、包括整合scope和filter。以及根据ast.type优化dirty-check
</br>
module&inject包括模块和依赖注入管理。
</br>
Utils包括promise和http两块。其中http又分http Service & httpbackend Service
</br>

