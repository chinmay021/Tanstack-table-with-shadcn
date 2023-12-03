
import { DataTable } from "./DataTable"
import {data} from '../constants';



export default function Table() {

  return (
    <div className="container mx-auto py-10">
      <DataTable defaultData={data}  />
    </div>
  )
}
