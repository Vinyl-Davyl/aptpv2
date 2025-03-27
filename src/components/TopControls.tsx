import React from "react";
import { Button, Tooltip, Badge } from "antd";
import { SettingOutlined, DatabaseOutlined, ShareAltOutlined } from "@ant-design/icons";
import styled from "styled-components";
import useAppStore from "../store/store";
import SampleDropdown from "./SampleDropdown";
import UseShare from "./UseShare";

const ControlBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 0;
`;

const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StyledBadge = styled(Badge)<{ $isDark: boolean }>`
  .ant-badge-status-text {
    color: ${(props) => (props.$isDark ? "#e0e0e0" : "#666")} !important;
    font-size: 14px;
    margin-left: 8px;
  }
`;

const StyledIconButton = styled(Button)<{ $isDark: boolean }>`
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid ${(props) => (props.$isDark ? "#444" : "#d9d9d9")};
  color: ${(props) => (props.$isDark ? "#e0e0e0" : "#1b2540")};

  &:hover,
  &:focus {
    background: transparent;
    border-color: ${(props) => (props.$isDark ? "#19c6c7" : "#1b2540")};
    color: ${(props) => (props.$isDark ? "#19c6c7" : "#1b2540")};
  }
`;

const TopControls: React.FC<any> = ({ setLoading, onSettingsClick }) => {
  const backgroundColor = useAppStore((state) => state.backgroundColor);
  const isDark = backgroundColor === "#2a2a2a";
  const theme = isDark ? "dark" : "light";

  return (
    <ControlBar>
      <LeftControls>
        <SampleDropdown setLoading={setLoading} buttonType="primary" theme={theme} icon={<DatabaseOutlined />} />
        <UseShare buttonType="secondary" theme={theme} icon={<ShareAltOutlined />} />
      </LeftControls>
      <RightControls>
        <StyledBadge status="success" text="Ready" $isDark={isDark} />
        <Tooltip title="Settings">
          <StyledIconButton $isDark={isDark} icon={<SettingOutlined />} onClick={onSettingsClick} />
        </Tooltip>
      </RightControls>
    </ControlBar>
  );
};

export default TopControls;
