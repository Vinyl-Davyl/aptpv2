import React from "react";
import styled from "styled-components";
import { CloseOutlined, WarningOutlined } from "@ant-design/icons";
import useAppStore from "../../store/store";

const ConsoleWrapper = styled.div<{ isVisible: boolean; isDark: boolean }>`
  position: fixed;
  bottom: 0;
  left: 56px;
  right: 0;
  height: ${({ isVisible }) => (isVisible ? "200px" : "30px")};
  background-color: ${({ isDark }) => (isDark ? "#1E1E1E" : "#f0f0f0")};
  border-top: 1px solid ${({ isDark }) => (isDark ? "#333" : "#ddd")};
  transition: height 0.3s ease;
  z-index: 1000;
`;

const ConsoleHeader = styled.div<{ isDark: boolean }>`
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${({ isDark }) => (isDark ? "#2D2D2D" : "#e6e6e6")};
  cursor: pointer;
`;

const ConsoleContent = styled.div<{ isDark: boolean }>`
  height: calc(100% - 30px);
  overflow-y: auto;
  padding: 10px;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-size: 12px;
  color: ${({ isDark }) => (isDark ? "#fff" : "#333")};
`;

const ConsoleMessage = styled.div<{ type: "error" | "info"; isDark: boolean }>`
  padding: 8px;
  margin: 4px 0;
  border-radius: 4px;
  background-color: ${({ type, isDark }) =>
    type === "error"
      ? isDark
        ? "rgba(255, 0, 0, 0.1)"
        : "rgba(255, 0, 0, 0.05)"
      : isDark
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.05)"};
  border-left: 3px solid ${({ type }) => (type === "error" ? "#ff4d4f" : "#1890ff")};
`;

const Console: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const backgroundColor = useAppStore((state) => state.backgroundColor);
  const isDark = backgroundColor === "#2a2a2a";
  const consoleMessages = useAppStore((state) => state.consoleMessages);
  const clearConsole = useAppStore((state) => state.clearConsole);

  return (
    <ConsoleWrapper isVisible={isVisible} isDark={isDark}>
      <ConsoleHeader isDark={isDark} onClick={() => setIsVisible(!isVisible)}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <WarningOutlined style={{ color: consoleMessages.some((m) => m.type === "error") ? "#ff4d4f" : "#1890ff" }} />
          <span>Console {consoleMessages.length > 0 && `(${consoleMessages.length})`}</span>
        </div>
        {isVisible && (
          <CloseOutlined
            onClick={(e) => {
              e.stopPropagation();
              clearConsole();
            }}
          />
        )}
      </ConsoleHeader>
      {isVisible && (
        <ConsoleContent isDark={isDark}>
          {consoleMessages.map((message, index) => (
            <ConsoleMessage key={index} type={message.type} isDark={isDark}>
              {message.timestamp.toLocaleTimeString()} - {message.content}
            </ConsoleMessage>
          ))}
        </ConsoleContent>
      )}
    </ConsoleWrapper>
  );
};

export default Console;
