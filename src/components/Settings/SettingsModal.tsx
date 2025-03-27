import React from "react";
import { Modal, Tabs, Switch, Form, Input, Button } from "antd";
import styled from "styled-components";
import useAppStore from "../../store/store";

const StyledModal = styled(Modal)<{ theme: "dark" | "light" }>`
  .ant-modal-content {
    background-color: ${(props) => (props.theme === "dark" ? "#2a2a2a" : "#ffffff")};
    color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#000000")};
  }

  .ant-modal-header {
    background-color: ${(props) => (props.theme === "dark" ? "#2a2a2a" : "#ffffff")};
    color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#000000")};
  }

  .ant-tabs-tab {
    color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#000000")} !important;
  }

  .ant-form-item-label > label {
    color: ${(props) => (props.theme === "dark" ? "#ffffff" : "#000000")};
  }
`;

const SettingsSection = styled.div`
  padding: 16px;

  h4 {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
  }
`;

const APIForm = styled(Form)`
  max-width: 500px;

  .ant-form-item {
    margin-bottom: 24px;
  }
`;

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const backgroundColor = useAppStore((state) => state.backgroundColor);
  const isDark = backgroundColor === "#2a2a2a";

  const handleAPISubmit = (values: any) => {
    console.log("API Keys:", values);
    // Handle API key storage
  };

  return (
    <StyledModal
      title="Settings"
      open={open}
      onCancel={onClose}
      footer={null}
      width={600}
      theme={isDark ? "dark" : "light"}
    >
      <Tabs
        items={[
          {
            key: "1",
            label: "Appearance",
            children: (
              <SettingsSection>
                <h4>Theme</h4>
                <Switch checked={isDark} checkedChildren="Dark" unCheckedChildren="Light" />
              </SettingsSection>
            ),
          },
          {
            key: "2",
            label: "Editor",
            children: (
              <SettingsSection>
                <h4>Editor Settings</h4>
                <Form layout="vertical">
                  <Form.Item label="Font Size" name="fontSize">
                    <Input type="number" min={8} max={32} defaultValue={14} />
                  </Form.Item>
                </Form>
              </SettingsSection>
            ),
          },
          {
            key: "3",
            label: "API Keys",
            children: (
              <SettingsSection>
                <h4>API Configuration</h4>
                <APIForm layout="vertical" onFinish={handleAPISubmit}>
                  <Form.Item
                    label="HuggingFace API Key"
                    name="huggingfaceKey"
                    rules={[{ required: true, message: "Please input your HuggingFace API key!" }]}
                  >
                    <Input.Password placeholder="Enter your HuggingFace API key" />
                  </Form.Item>

                  <Form.Item
                    label="Gemini API Key"
                    name="geminiKey"
                    rules={[{ required: true, message: "Please input your Gemini API key!" }]}
                  >
                    <Input.Password placeholder="Enter your Gemini API key" />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Save API Keys
                    </Button>
                  </Form.Item>
                </APIForm>
              </SettingsSection>
            ),
          },
        ]}
      />
    </StyledModal>
  );
};

export default SettingsModal;
