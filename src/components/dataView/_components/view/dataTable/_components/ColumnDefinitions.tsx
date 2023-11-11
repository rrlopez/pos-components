
export default {
  check: {
    id: '_check',
    size: 30,
    sortable: false,
    draggable: false,
    resizable: false,
    filterable: false,
    freezable: { permanent: true },
    visible: true,
    headerText: 'Check',
    header: ({ table }: any) => {
      return (
        <input
          type='checkbox'
          className='checkbox checkbox-sm'
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected()?'true':'false',
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      )
    },
    cell: ({ row }: any) => (
      <input
        type='checkbox'
        className='checkbox checkbox-sm'
        {...{
          checked: row.getIsSelected(),
          disabled: !row.getCanSelect(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  },
  number: {
    id: '_number',
    size: 40,
    sortable: false,
    draggable: false,
    resizable: false,
    filterable: false,
    freezable: { permanent: true },
    visible: true,
    className: 'text-left',
    headerClassName: 'pl-1',
    header: 'No.',
    cell: ({ i }: any) => i + 1,
  },
  action: {
    id: '_action',
    size: 70,
    sortable: false,
    draggable: false,
    resizable: false,
    filterable: false,
    freezable: { permanent: true },
    visible: true,
    header: 'Action',
  },
}
