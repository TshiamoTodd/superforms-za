import { GetFormWithSubmissions } from '@/actions/form';
import React, { ReactNode } from 'react'
import { ElementsType, FormElementInstance } from './form-elements';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { format, formatDistance } from 'date-fns';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';

type Row = {[ker: string]: string } & {
  submittedAt: Date
};

async function SubmissionsTable({id}: {id: number}) {
  const form = await GetFormWithSubmissions(id);

  if(!form) throw new Error('Form not found');

  const formElements = JSON.parse(form.content) as FormElementInstance[];

  const columns: {
    id: string,
    label: string,
    required: boolean,
    type: ElementsType,
  }[] = [];

  formElements.forEach((element) => {
    switch(element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows: Row[] = [];

  form.formSubmissions.forEach((submission) => {
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  });
  
  return (
    <>
        <h1 className='text-2xl font-bold my-4'>
            Submissions
        </h1>
        <div className='rounded-md border mb-6'>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.id} className='uppercase'>
                    {column.label}
                  </TableHead>
                ))}
                <TableHead className='text-muted-foreground text-right uppercase'>
                  Submitted at
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <RowCell 
                      key={column.id}
                      type={column.type}
                      value={row[column.id]}
                    />
                  ))}
                  <TableCell className='text-muted-foreground text-right'>
                    {formatDistance(row.submittedAt, new Date(), { 
                      addSuffix: true,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
    </>
  )
}

function RowCell({type, value}: {type: ElementsType, value: string}) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      if(!value) break;
      const date = new Date(value);
      node = <Badge variant={'outline'}>
        {format(date, "dd/MM/yyyy")}
      </Badge>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled/>
  }
  return <TableCell>{node}</TableCell>;
}

export default SubmissionsTable