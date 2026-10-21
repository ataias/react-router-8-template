import { db } from "~/db/db.server";
import type { Route } from "./+types/table";
import { expenditureTable } from "~/db/schema";
import { sum } from "drizzle-orm";

async function getTable() {
  const rows = await db.select().from(expenditureTable);
  const totalRaw = await db.select({ total: sum(expenditureTable.cost) }).from(expenditureTable);
  const total: number = Number(totalRaw.at(0)?.total);
  return { rows, total };
}

export async function loader(_prop: Route.LoaderArgs) {
  const moneyFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
  const data = await getTable();

  type TableRow = { id: string; title: string; cost: string };

  const rows: TableRow[] = data.rows.map((row) => ({
    id: row.id,
    title: row.title,
    cost: moneyFormatter.format(row.cost),
  }));
  const footer: TableRow = {
    id: "footer",
    title: "Totals",
    cost: moneyFormatter.format(data.total),
  };

  return {
    columns: ["Items", "Expenditure"],
    rows,
    footer,
  };
}

export default function TablePage({ loaderData }: Route.ComponentProps) {
  const { columns, rows, footer } = loaderData;
  return (
    <table>
      <caption>Council budget (in £) 2018</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} scope="col">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <th scope="row">{row.title}</th>
            <td>{row.cost}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">{footer.title}</th>
          <td>{footer.cost}</td>
        </tr>
      </tfoot>
    </table>
  );
}
