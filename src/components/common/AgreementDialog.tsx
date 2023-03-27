import React from "react";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export const AgreementDialog = () => (
  <div>
    <DialogTitle id="scroll-dialog-title">IAS系统条款与合规手册</DialogTitle>
    <DialogContent>
      <DialogContentText component="div">
        <div>
          <ol style={{ paddingLeft: 20 }}>
            <li>
              IAS是ZXTDAssetManagementLimited("ZXTD")接收机构服务的综合研究服务平台。
              在此平台上提供或交互的任何信息都不会被视为直接的投资建议或投资推荐。Barn所进行的所有投资决定均来自于我们的基金经理的独立判断，并经过全面且复杂的内部分析。
            </li>
            <li>
              提交研究服务的要求：
              <ol type="I">
                <li>
                  提交给IAS平台的所有研究推荐都必须包含详细，完整的推荐理由。该理由可以用文本编写或语音录入。用户有责任提供充分，清楚，且没有任何误导性的推荐理由。
                  Barn或监管部门有可能要求用户进一步解释研究推荐的相关理由和逻辑，用户有责任配合和提供更详细的资料；
                </li>
                <li>
                  研究分析师在提交研究研究推荐和理由时，必须附上其最新发表的报告/电子邮件/其他已发布信息。
                  “其他已发布信息”的定义包括：已发布的路演材料，在已授权的客户群内的评论等。
                  用户提交的研究推荐必须与分析师在附件中所包含的研究内容保持一致性；
                </li>
                <li>
                  研究销售人员不得提交涉及任何公司内部未发布信息的研究推荐。
                </li>
              </ol>
            </li>
            <li>
              关于内幕信息：IAS的用户必须遵守所有当地法律法规要求，必须遵守用户所在机构的内部合规风控要求。
              提交给IAS平台的所有信息都必须合法合规，并且不得包含任何内幕信息。
              支持或解释用户提交的研究理由的所有信息必须属于或者基于公开信息。
            </li>
            <li>
              关于市场谣言：用户必须区分公开市场传言和非公开谣言。
              用户可以利用广泛的公开市场传言来作为相关研究推荐的理由。
              用户不应提交任何非公开传言/谣言来作为研究推荐的理由。
              用户不得通过IAS平台发起任何谣言或非公开信息。
            </li>
            <li>
              使用IAS系统时，用户不得执行的其他操作：
              <ol type="I">
                <li>
                  非法或不当使用ZXTD和IAS的知识产权，泄露与IAS平台相关的机密或信息；
                </li>
                <li>
                  可能破坏或损害ZXTD的系统安全，可能破坏或损害ZXTD的数据安全的行为；
                </li>
                <li>可能会损害ZXTD声誉的行为。</li>
              </ol>
            </li>
            <li>
              个人数据的使用和保护：
              <ol type="I">
                <li>
                  我们可能会获取、存储和使用您的个人数据，用于ZXTD的基金运作、基金统计、客户交流；
                </li>
                <li>
                  我们可能获取、存储和使用您的个人数据以满足法律、法规和合规性要求；
                </li>
                <li>
                  我们不会出于非上述第i和ii条的任何原因获取、存储和使用您的个人数据。
                </li>
              </ol>
            </li>
            <li>
              通过登录IAS平台（网站，移动应用程序，微信小程序），用户确认：
              <ol type="I">
                <li>
                  用户本人是持有相关资格和受到行业监管的人士，用户所在的机构也受到监管并拥有提供研究服务的资格；
                </li>
                <li>
                  用户本人清楚地了解IAS的合规性要求，并无条件地同意和接受本手册中所述的条款和条件。
                </li>
              </ol>
            </li>
            <li>
              本手册及其相关条款和条件可能出现不同的语言版本。条款的表达和解释可能会因语言差异而有所不同。
              如果英语版本与中文版本之间存在任何歧义，则以英语版本为准。
            </li>
            <li>
              通过使用IAS系统（网站，应用程序，微信小程序），您同意无条件接受本手册中的条款。
              这些条款可能会被ZXTD修改和/或修订，恕不另行通知。请定期登入IAS系统以了解可能进行的任何修订和/或修改。
            </li>
          </ol>
        </div>
      </DialogContentText>
    </DialogContent>
  </div>
);
