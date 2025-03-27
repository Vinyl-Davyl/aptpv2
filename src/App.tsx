"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { App as AntdApp, Layout, Row, Col, Tabs, Button, Spin } from "antd"; // Added Spin for loading
import { Routes, Route, useNavigate } from "react-router-dom";
import SampleDropdown from "./components/SampleDropdown";
import UseShare from "./components/UseShare";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TemplateMarkdown from "./editors/editorsContainer/TemplateMarkdown";
import TemplateModel from "./editors/editorsContainer/TemplateModel";
import AgreementData from "./editors/editorsContainer/AgreementData";
import LearnNow from "./pages/LearnNow";
import LearnContent from "./components/Content";
import useAppStore from "./store/store";
import ResizableSplitPane from "./components/ResizableSplitPane";
import SettingsModal from "./components/Settings/SettingsModal";
import Sidebar from "./components/Sidebar/Sidebar";
import Console from "./components/Console/Console";
import { handleError } from "./utils/console/errorHandling";
import TopControls from "./components/TopControls";

const { Content } = Layout;

interface TabItem {
  key: string;
  label: string;
  children: React.ReactNode;
}

const TransitionPage: React.FC<{
  previewData: string | null;
  error: string | null;
}> = ({ previewData, error }) => {
  const navigate = useNavigate();
  const backgroundColor = useAppStore((state) => state.backgroundColor);
  const textColor = useAppStore((state) => state.textColor);

  const handleBackToEditor = (): void => {
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          backgroundColor: backgroundColor === "#2a2a2a" || backgroundColor === "#4a4a4a" ? "#3a3a3a" : "#ffffff",
          color: textColor,
          padding: "24px",
          borderRadius: "10px",
          boxShadow:
            backgroundColor === "#2a2a2a" || backgroundColor === "#4a4a4a"
              ? "0 4px 8px rgba(0, 0, 0, 0.3)"
              : "0 4px 8px rgba(0, 0, 0, 0.1)",
          maxWidth: "800px",
          width: "100%",
          position: "relative",
        }}
      >
        <Button
          onClick={handleBackToEditor}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "#1b2540",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.color = "#111111";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = "#1b2540";
            e.currentTarget.style.color = "#ffffff";
          }}
        >
          Back to Editor
        </Button>
        <h2
          style={{
            fontSize: "20px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          Transition Preview
        </h2>
        {error ? (
          <div style={{ color: "red", fontSize: "14px", textAlign: "center" }}>{error}</div>
        ) : previewData ? (
          <div
            style={{
              maxHeight: "70vh",
              overflowY: "auto",
              color: textColor,
            }}
            dangerouslySetInnerHTML={{ __html: previewData }}
          />
        ) : (
          <div
            style={{
              color: backgroundColor === "#2a2a2a" || backgroundColor === "#4a4a4a" ? "#aaa" : "#888",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            No preview available. Please ensure the template, model, and data are valid.
          </div>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("templateMark");
  const [loading, setLoading] = useState<boolean>(false); // Added loading state
  const [settingsOpen, setSettingsOpen] = useState(false);

  const backgroundColor = useAppStore((state) => state.backgroundColor);
  const textColor = useAppStore((state) => state.textColor);
  const agreementHtml = useAppStore((state) => state.agreementHtml);
  const error = useAppStore((state) => state.error);
  const init = useAppStore((state) => state.init);

  const navigate = useNavigate();

  useEffect(() => {
    init();
  }, [init]);

  const onTabChange = (key: string): void => {
    setActiveTab(key);
  };

  const scrollToFooter = (): void => {
    const footerElement = document.getElementById("footer");
    if (footerElement) {
      footerElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleViewTransition = () => {
    if (error) {
      handleError("Cannot transition with errors present");
      return;
    }
    navigate("/transition");
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .ant-tabs-nav {
        background-color: ${backgroundColor === "#2a2a2a" ? "#3a3a3a" : "#f5f5f5"} !important;
        padding: 8px 16px;
        border-bottom: 1px solid ${backgroundColor === "#2a2a2a" ? "#444" : "#ddd"} !important;
      }
      .ant-tabs-tab {
        color: ${textColor} !important;
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 4px;
      }
      .ant-tabs-tab-active .ant-tabs-tab-btn {
        color: #19c6c7 !important;
        font-weight: 500;
      }
      .ant-tabs-tab:hover {
        color: #19c6c7 !important;
      }
      .ant-tabs-ink-bar {
        background-color: #19c6c7 !important;
      }
      .ant-tabs-content {
        background-color: ${backgroundColor} !important;
      }
      .editor-container textarea, .editor-container .CodeMirror, .editor-container .monaco-editor {
        background-color: ${backgroundColor === "#2a2a2a" ? "#3a3a3a" : "#f5f5f5"} !important;
        color: ${textColor} !important;
        border: 1px solid ${backgroundColor === "#2a2a2a" ? "#444" : "#ddd"} !important;
        border-radius: 8px !important;
        padding: 10px !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 14px !important;
        line-height: 1.5 !important;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1) !important;
      }
      .editor-container .CodeMirror-line, .editor-container .monaco-editor .view-line {
        color: ${textColor} !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [backgroundColor, textColor]);

  const tabItems: TabItem[] = [
    {
      key: "templateMark",
      label: "TemplateMark",
      children: <TemplateMarkdown />,
    },
    {
      key: "model",
      label: "Concerto Model",
      children: <TemplateModel />,
    },
    {
      key: "data",
      label: "Preview Data",
      children: <AgreementData />,
    },
  ];

  return (
    <AntdApp>
      <Layout style={{ minHeight: "100vh" }}>
        <Navbar scrollToFooter={scrollToFooter} />
        <Layout>
          <Sidebar onSettingsClick={() => setSettingsOpen(true)} />
          <Layout>
            <Content style={{ background: backgroundColor }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <div style={{ height: "calc(100vh - 100px)", display: "flex", flexDirection: "column" }}>
                      <div style={{ padding: "24px 0 0 0" }}>
                        <Row>
                          <Col xs={24} style={{ paddingLeft: "24px", paddingRight: "24px" }}>
                            <TopControls setLoading={setLoading} onSettingsClick={() => setSettingsOpen(true)} />
                          </Col>
                        </Row>
                      </div>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <ResizableSplitPane
                          backgroundColor={backgroundColor}
                          defaultSize={65}
                          minSize={20}
                          left={
                            <div style={{ height: "100%", width: "100%" }}>
                              <Tabs
                                activeKey={activeTab}
                                onChange={onTabChange}
                                items={tabItems}
                                type="line"
                                style={{ color: textColor, height: "100%" }}
                              />
                            </div>
                          }
                          right={
                            <div
                              style={{
                                backgroundColor: backgroundColor === "#2a2a2a" ? "#3a3a3a" : "#ffffff",
                                color: textColor,
                                padding: "15px",
                                borderTop: `0.5px solid ${backgroundColor === "#2a2a2a" ? "#444" : "#ddd"}`,
                                height: "100%",
                                width: "100%",
                                position: "relative",
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: backgroundColor === "#2a2a2a" ? "#3a3a3a" : "#ffffff",
                                  color: textColor,
                                  padding: "15px",
                                  flex: 1,
                                  width: "100%",
                                  overflowY: "auto",
                                  position: "relative",
                                }}
                              >
                                <Button
                                  onClick={handleViewTransition}
                                  style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    backgroundColor: "#1b2540",
                                    color: "#ffffff",
                                    border: "none",
                                    borderRadius: "5px",
                                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                    e.currentTarget.style.backgroundColor = "#ffffff";
                                    e.currentTarget.style.color = "#111111";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.backgroundColor = "#1b2540";
                                    e.currentTarget.style.color = "#ffffff";
                                  }}
                                >
                                  Dynamic View
                                </Button>
                                <h3 style={{ fontSize: "16px", margin: "0 0 16px 0" }}>Preview Output</h3>
                                <p
                                  style={{
                                    fontSize: "12px",
                                    opacity: 0.7,
                                    marginBottom: "16px",
                                  }}
                                >
                                  The result of merging the JSON data with the template.
                                </p>
                                {error ? (
                                  <div style={{ color: "red", fontSize: "14px" }}>{error}</div>
                                ) : agreementHtml ? (
                                  <div dangerouslySetInnerHTML={{ __html: agreementHtml }} />
                                ) : loading ? (
                                  <div style={{ textAlign: "center" }}>
                                    <Spin size="large" style={{ color: textColor }} />
                                  </div>
                                ) : (
                                  <div style={{ color: "#888", fontSize: "14px" }}>
                                    No preview available. Please ensure the template, model, and data are valid.
                                  </div>
                                )}
                              </div>
                            </div>
                          }
                        />
                      </div>
                    </div>
                  }
                />
                <Route
                  path="/transition"
                  element={<TransitionPage previewData={agreementHtml} error={error ?? null} />}
                />
                <Route path="/learn" element={<LearnNow />}>
                  <Route path="intro" element={<LearnContent file="intro.md" />} />
                  <Route path="module1" element={<LearnContent file="module1.md" />} />
                  <Route path="module2" element={<LearnContent file="module2.md" />} />
                  <Route path="module3" element={<LearnContent file="module3.md" />} />
                </Route>
              </Routes>
            </Content>
          </Layout>
        </Layout>
        <Footer />
        <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </Layout>
    </AntdApp>
  );
};

export default App;
