import React from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import styled from "styled-components";
import Console from "./Console/Console";

// Styled resizer handle
const StyledResizeHandle = styled(PanelResizeHandle)<{ theme: "dark" | "light" }>`
  width: 8px;
  background-color: ${(props) => (props.theme === "dark" ? "#444" : "#ddd")};
  margin: 0 -2px;
  position: relative;
  cursor: col-resize;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) => (props.theme === "dark" ? "#666" : "#aaa")};
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 40px;
    background-color: ${(props) => (props.theme === "dark" ? "#777" : "#ccc")};
    border-radius: 1px;
  }
`;

// Container for the panel group
const PanelContainer = styled.div`
  height: calc(100vh - 200px);
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const PanelGroupContainer = styled.div`
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 0;
`;

interface ResizableSplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  backgroundColor: string;
}

const ResizableSplitPane: React.FC<ResizableSplitPaneProps> = ({
  left,
  right,
  defaultSize = 65,
  minSize = 20,
  backgroundColor,
}) => {
  const isDarkMode = backgroundColor === "#2a2a2a" || backgroundColor === "#4a4a4a";
  const theme = isDarkMode ? "dark" : "light";

  return (
    <PanelContainer>
      <PanelGroupContainer>
        <PanelGroup direction="horizontal">
          <Panel
            defaultSize={defaultSize}
            minSize={minSize}
            style={{
              height: "100%",
              overflow: "auto",
            }}
          >
            {left}
          </Panel>

          <StyledResizeHandle theme={theme} />

          <Panel
            style={{
              height: "100%",
              overflow: "auto",
            }}
          >
            {right}
          </Panel>
        </PanelGroup>
      </PanelGroupContainer>
      <Console />
    </PanelContainer>
  );
};

export default ResizableSplitPane;
