import { Button, Dropdown, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useCallback, useMemo, useState } from "react";
import useAppStore from "../store/store";
import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";
import styled from "styled-components";
import { handleError } from "../utils/console/errorHandling";

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

interface SampleDropdownProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  buttonType?: "primary" | "secondary";
  theme?: "dark" | "light";
  icon?: React.ReactNode;
}

function SampleDropdown({ setLoading, buttonType = "primary", theme = "dark", icon }: SampleDropdownProps) {
  const { samples, loadSample } = useStoreWithEqualityFn(
    useAppStore,
    (state) => ({
      samples: state.samples,
      loadSample: state.loadSample as (key: string) => Promise<void>,
    }),
    shallow
  );

  const [selectedSample, setSelectedSample] = useState<string | null>(null);

  const items = useMemo(
    () =>
      samples?.map((s) => ({
        label: s.NAME,
        key: s.NAME,
      })) || [],
    [samples]
  );

  const handleMenuClick = useCallback(
    async ({ key }: { key: string }) => {
      if (key) {
        setLoading(true);
        try {
          await loadSample(key);
          message.success(`Loaded ${key} sample`);
          setSelectedSample(key);
        } catch (err) {
          handleError(err instanceof Error ? err.message : "An error occurred loading the sample");
        } finally {
          setLoading(false);
        }
      }
    },
    [loadSample, setLoading]
  );

  const ButtonComponent = buttonType === "primary" ? PrimaryButton : SecondaryButton;

  return (
    <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={["click"]}>
      <ButtonComponent theme={theme} aria-label="Load sample dropdown">
        {icon}
        {selectedSample || "Load Sample"}
        <DownOutlined style={{ marginLeft: 8 }} />
      </ButtonComponent>
    </Dropdown>
  );
}

export default SampleDropdown;
