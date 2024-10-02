import { ConnectionStatusType } from "./workspace-toolbar";

export function ConnectionStatus(props: {
  connectionStatus: ConnectionStatusType;
  showText?: boolean;
}) {
  const connectionStatus = props.connectionStatus;
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          connectionStatus === "connected"
            ? "bg-green-500"
            : connectionStatus === "disconnected"
              ? "bg-red-500"
              : "bg-slate-500"
        }`}
      />
      {props.showText && (
        <span>
          {connectionStatus === "connected"
            ? "Connected"
            : connectionStatus === "disconnected"
              ? "Disconnected"
              : "Pending"}
        </span>
      )}
    </div>
  );
}
