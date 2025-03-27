import { useState } from "react";
import { Button, message } from "antd";
import useAppStore from "../store/store";
import styled from "styled-components";

const PrimaryButton = styled(Button)<{ theme: "dark" | "light" }>`
  background: ${(props) => (props.theme === "dark" ? "#19c6c7" : "#1b2540")};
  color: ${(props) => (props.theme === "dark" ? "#050c40" : "#ffffff")};
  border: none;
  border-radius: 8px;
  height: 40px;
  padding: 0 16px;

  &:hover,
  &:focus {
    background: ${(props) => (props.theme === "dark" ? "#0fb1b2" : "#2a3a5f")};
    color: ${(props) => (props.theme === "dark" ? "#050c40" : "#ffffff")};
  }
`;

const SecondaryButton = styled(Button)<{ theme: "dark" | "light" }>`
  background: transparent;
  color: ${(props) => (props.theme === "dark" ? "#e0e0e0" : "#1b2540")};
  border: 1px solid ${(props) => (props.theme === "dark" ? "#444" : "#d9d9d9")};
  border-radius: 8px;
  height: 40px;
  padding: 0 16px;

  &:hover,
  &:focus {
    border-color: ${(props) => (props.theme === "dark" ? "#19c6c7" : "#1b2540")};
    color: ${(props) => (props.theme === "dark" ? "#19c6c7" : "#1b2540")};
  }
`;

interface UseShareProps {
  buttonType?: "primary" | "secondary";
  theme?: "dark" | "light";
  icon?: React.ReactNode;
}

const UseShare = ({ buttonType = "secondary", theme = "dark", icon }: UseShareProps) => {
  const generateShareableLink = useAppStore((state) => state.generateShareableLink);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const link = generateShareableLink();
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      message.success("Link copied to clipboard!");
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    });
  };

  const ButtonComponent = buttonType === "primary" ? PrimaryButton : SecondaryButton;

  return (
    <ButtonComponent theme={theme} onClick={handleCopy}>
      {icon}
      {copied ? "Copied!" : "Share"}
    </ButtonComponent>
  );
};

export default UseShare;
