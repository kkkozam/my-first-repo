export default function Catalog() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">项目模板目录</h1>

      {/* 模板能力描述区域 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">feature描述</h2>
        <div className="bg-gray-50 p-6 rounded-lg border">
          <p className="text-gray-600 italic">
            <ul className="list-disc list-inside">
              <li>Tailwind CSS</li>
              <li>按住Option + 点击,跳转到对应代码</li>
              <li>eslint,prettier,stylelint,husky,commitlint</li>
              <li>react router v6 + ts类型安全</li>
              <li>接入远望平台</li>
            </ul>
          </p>
        </div>
      </div>

      {/* 目录结构描述区域 */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-green-600">目录结构</h2>
        <div className="bg-gray-50 p-6 rounded-lg border">
          <div className="space-y-4">
            <div className="font-mono text-sm">
              <div className="text-gray-800">
                <div className="font-bold text-lg mb-2">app/</div>
                <div className="ml-4">
                  <div className="mb-2">
                    <div className="flex items-center">
                      <span>├── assets/</span>
                      <span className="ml-2 text-sm text-gray-600">静态资源目录</span>
                    </div>
                    <div className="ml-4 mb-1">
                      <div className="flex items-center">
                        <span>├── fonts/</span>
                        <span className="ml-2 text-sm text-gray-600">字体文件</span>
                      </div>
                      <div className="flex items-center">
                        <span>├── imgs/</span>
                        <span className="ml-2 text-sm text-gray-600">图片资源</span>
                      </div>
                      <div className="flex items-center">
                        <span>└── locales/</span>
                        <span className="ml-2 text-sm text-gray-600">国际化文件</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center">
                      <span>└── src/</span>
                      <span className="ml-2 text-sm text-gray-600">源代码目录</span>
                    </div>
                    <div className="ml-4">
                      <div className="mb-2">
                        <div className="flex items-center">
                          <span>├── apis/</span>
                          <span className="ml-2 text-sm text-gray-600">API接口管理</span>
                        </div>
                        <div className="ml-4 mb-1">
                          <div className="flex items-center">
                            <span>├── axios.ts</span>
                            <span className="ml-2 text-sm text-gray-600">HTTP请求配置</span>
                          </div>
                          <div className="flex items-center">
                            <span>├── common/</span>
                            <span className="ml-2 text-sm text-gray-600">通用API</span>
                          </div>
                          <div className="ml-4 mb-1">
                            <div className="flex items-center">
                              <span>├── getUserInfo.ts</span>
                              <span className="ml-2 text-sm text-gray-600">用户信息接口</span>
                            </div>
                            <div className="flex items-center">
                              <span>└── index.ts</span>
                              <span className="ml-2 text-sm text-gray-600">API导出</span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span>└── index.ts</span>
                            <span className="ml-2 text-sm text-gray-600">API入口</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center">
                          <span>├── components/</span>
                          <span className="ml-2 text-sm text-gray-600">可复用组件</span>
                        </div>
                        <div className="ml-4 mb-1">
                          <div className="flex items-center">
                            <span>└── index.ts</span>
                            <span className="ml-2 text-sm text-gray-600">组件导出</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center">
                          <span>├── constants/</span>
                          <span className="ml-2 text-sm text-gray-600">常量定义</span>
                        </div>
                        <div className="ml-4 mb-1">
                          <div className="flex items-center">
                            <span>├── exampleConst.ts</span>
                            <span className="ml-2 text-sm text-gray-600">示例常量</span>
                          </div>
                          <div className="flex items-center">
                            <span>└── index.ts</span>
                            <span className="ml-2 text-sm text-gray-600">常量导出</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center">
                          <span>├── hooks/</span>
                          <span className="ml-2 text-sm text-gray-600">自定义Hooks</span>
                        </div>
                        <div className="ml-4 mb-1">
                          <div className="flex items-center">
                            <span>├── index.ts</span>
                            <span className="ml-2 text-sm text-gray-600">Hooks导出</span>
                          </div>
                          <div className="flex items-center">
                            <span>└── useUserInfo.tsx</span>
                            <span className="ml-2 text-sm text-gray-600">用户信息Hook</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center">
                          <span>├── nodes/</span>
                          <span className="ml-2 text-sm text-gray-600">页面组件</span>
                        </div>
                        <div className="ml-4 mb-1">
                          <div className="flex items-center">
                            <span>└── home/</span>
                            <span className="ml-2 text-sm text-gray-600">首页模块</span>
                          </div>
                          <div className="ml-4 mb-1">
                            <div className="flex items-center">
                              <span>├── Catalog.tsx</span>
                              <span className="ml-2 text-sm text-gray-600">目录组件</span>
                            </div>
                            <div className="flex items-center">
                              <span>├── Home.tsx</span>
                              <span className="ml-2 text-sm text-gray-600">首页组件</span>
                            </div>
                            <div className="flex items-center">
                              <span>└── index.ts</span>
                              <span className="ml-2 text-sm text-gray-600">模块导出</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center">
                          <span>├── styles/</span>
                          <span className="ml-2 text-sm text-gray-600">样式文件</span>
                        </div>
                        <div className="ml-4 mb-1">
                          <div className="flex items-center">
                            <span>├── global.scss</span>
                            <span className="ml-2 text-sm text-gray-600">全局样式</span>
                          </div>
                          <div className="flex items-center">
                            <span>└── tailwind-base.scss</span>
                            <span className="ml-2 text-sm text-gray-600">Tailwind基础样式</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-2">
                        <div className="flex items-center">
                          <span>├── utils/</span>
                          <span className="ml-2 text-sm text-gray-600">工具函数</span>
                        </div>
                        <div className="ml-4 mb-1">
                          <div className="flex items-center">
                            <span>└── index.ts</span>
                            <span className="ml-2 text-sm text-gray-600">工具函数导出</span>
                          </div>
                        </div>
                      </div>
                      <div className="mb-1">
                        <div className="flex items-center">
                          <span>├── App.tsx</span>
                          <span className="ml-2 text-sm text-gray-600">应用根组件</span>
                        </div>
                        <div className="flex items-center">
                          <span>├── index.html</span>
                          <span className="ml-2 text-sm text-gray-600">HTML模板</span>
                        </div>
                        <div className="flex items-center">
                          <span>├── index.tsx</span>
                          <span className="ml-2 text-sm text-gray-600">应用入口</span>
                        </div>
                        <div className="flex items-center">
                          <span>└── routes.ts</span>
                          <span className="ml-2 text-sm text-gray-600">路由配置</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
