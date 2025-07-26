import { getBlockchainStatus } from "@/lib/actions/blockchain-actions"
import { Badge } from "@/components/ui/badge"

export async function BlockchainStatus() {
  const status = await getBlockchainStatus()

  return (
    <div className="flex items-center space-x-2 text-xs lg:text-sm">
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${status.isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
        <span className="text-gray-600 hidden sm:inline">{status.isConnected ? "Connected" : "Disconnected"}</span>
      </div>

      <Badge variant="outline" className="text-xs">
        Block: {status.currentBlock}
      </Badge>

      <Badge variant="outline" className="text-xs hidden lg:inline-flex">
        Network: {status.network}
      </Badge>
    </div>
  )
}
