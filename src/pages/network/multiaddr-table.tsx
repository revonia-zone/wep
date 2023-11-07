import {Multiaddr} from "@multiformats/multiaddr";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {useNetworkStore} from "@/stores/network-store";

export default function MultiaddrTable({ className }: { className?: string }) {
  const multiaddrs = useNetworkStore((s) => s.multiaddrs)

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Multiaddr</TableHead>
          <TableHead>Protocols</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {multiaddrs.map((multiaddr) => {
          const string = multiaddr.toString()
          return (
            <TableRow key={string}>
              <TableCell className="font-medium">{string}</TableCell>
              <TableCell>{multiaddr.protoNames().join(', ')}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
