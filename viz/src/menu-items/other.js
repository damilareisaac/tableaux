// third-party
import { FormattedMessage } from "react-intl";

// assets
import { IconDatabaseImport, IconDeviceAnalytics } from "@tabler/icons";

// constant
const icons = {
  IconDatabaseImport,
  IconDeviceAnalytics,
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const other = {
  id: "sample-docs-roadmap",
  type: "group",
  children: [
    {
      id: "Data",
      title: <FormattedMessage id="data" />,
      type: "item",
      url: "/data-load",
      icon: icons.IconDatabaseImport,
      breadcrumbs: false,
    },
    {
      id: "Analytics",
      title: <FormattedMessage id="analytics" />,
      type: "item",
      url: "/analytics",
      icon: icons.IconDeviceAnalytics,
      breadcrumbs: false,
    },
  ],
};

export default other;
