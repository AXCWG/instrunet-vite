import {WebRoutes} from "../Singletons.js";

function Announcement() {
    return <>
        <div style={{display: "flex", flexDirection: "row-reverse"}}>
            <div style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center", maxWidth: "30rem"
            }}>
                <div className='generic-box-shadow-card'>
                    邮箱发送通知功能因为<u>未知原因</u>暂时禁用
                </div>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center", maxWidth: "30rem"
            }}>
                <div className='generic-box-shadow-card'>


                    <div className={"display-6"}>为各位的时间、耐心道歉🙇</div>
                    <div>近些天 服务器一直不稳定 有的是经济问题，另一些则是技术问题……</div>
                    <div><strong>不过没有关系！</strong>从前些天开始，重启服务器不再会导致待处理歌曲消失。这就意味着无论何时服务器关闭，再开启时不会需要你们重新上传歌曲。</div>
                    <br />
                    <div style={{ fontSize: "1.5rem" }}>对浪费各位的时间，再次道歉。</div>
                    <br />
                    <div>若遇到服务器无响应的问题，请致电：<a href={"tel:13693590652"}>我的电话</a></div>
                    <br />
                    <div>还望各位继续使用、多加交流。</div>
                    ——A.X. 6.9.25.15.17

                </div>

            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div className={"generic-box-shadow-card"}>
                    <h4 className={"text-danger"} style={{ fontWeight: "bold" }}>!5.29、6.9 更新!</h4>
                    <br />
                    <ul>
                        <li>
                            歌曲评论功能
                        </li>
                        <li>
                            歌曲点赞/点踩——用于通知我某伴奏是垃圾
                            需要重新上传完整版本。按下踩时我的邮箱会收到邮件通知。如果我在一段时间没有回应，在点踩数超过10时歌曲会自动删除（设计上
                            通常24小时内会处理）。
                        </li>
                        <li>6.29：新增缓存，网站播放、下载速度加快</li>
                    </ul>
                    同志们：这是我踏出建立社区梦想的众多第一步的其中一步 请各位赏脸了。
                    <br />
                    <br />

                    ——A.X. 5.29.25 21.53
                </div>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div className={"generic-box-shadow-card"}>
                    <h4>须知：</h4>
                    <br />
                    <u>网易云的音乐分为两类：VIP歌曲和VIP付费歌曲的东西。</u>
                    <br />
                    <br />
                    VIP歌曲365天随时可以下载，付费歌曲的话：
                    <br />
                    <br />
                    如果账号一个月超过了下载付费VIP歌曲的额度，就<strong>无法再下载需付费的VIP歌曲，</strong>就会显示<strong>“不存在”</strong>，就需要升级账号的额度，于是就需要升级账号，就要<span
                    style={{ fontSize: "3rem" }}>钱</span>。<br />
                    <br />
                    要不就自己开个网易云会员后下载后通过<a
                    href={WebRoutes.unlockMusic + "/"}>这个网站</a>解锁后上传到本网站后提取伴奏，要不就不用:)))

                </div>
            </div>
            <div style={{
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center"
            }}>
                <div className={"generic-box-shadow-card"}>
                    <h4>目前目标：</h4>
                    QQ音乐下载（寻找API中）
                    <br />
                    <br />
                    正经的，不加端口并且独立的域名（长远计划😂）
                    <br />
                </div>
            </div>
        </div>

    </>

}
export default Announcement;