import React from "react";
import { Layout, Tooltip } from "antd";
import { LayoutOutlined, CodeOutlined, ApiOutlined, SettingOutlined } from "@ant-design/icons";
import styled from "styled-components";

const { Sider } = Layout;

const StyledSider = styled(Sider)`
  background: #1b2540 !important;
  min-height: calc(100vh - 100px);

  .ant-layout-sider-children {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: sticky;
    top: 0;
  }
`;

const IconButton = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(25, 198, 199, 0.1);
    color: #19c6c7;
  }

  .anticon {
    font-size: 20px;
  }
`;

const SettingsButton = styled(IconButton)`
  margin-top: auto;
  margin-bottom: 16px;
`;

interface SidebarProps {
  onSettingsClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSettingsClick }) => {
  return (
    <StyledSider width={56}>
      <Tooltip title="Layout" placement="right">
        <IconButton>
          <LayoutOutlined />
        </IconButton>
      </Tooltip>

      <Tooltip title="Code" placement="right">
        <IconButton>
          <CodeOutlined />
        </IconButton>
      </Tooltip>

      <Tooltip title="API" placement="right">
        <IconButton>
          <ApiOutlined />
        </IconButton>
      </Tooltip>

      <Tooltip title="Settings" placement="right">
        <SettingsButton onClick={onSettingsClick}>
          <SettingOutlined />
        </SettingsButton>
      </Tooltip>
    </StyledSider>
  );
};

export default Sidebar;
