import {Multiaddr} from "@multiformats/multiaddr";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export default function MultiaddrTable({ multiaddrs, className }: { multiaddrs: Multiaddr[], className?: string }) {
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
