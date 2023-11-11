import { Meta } from '@storybook/react'
import _ from 'lodash'
import React from 'react'
import { VOIDED_LABELS_DATA } from '../sample_data/data'
import DataView from '../src/components/dataView'
import { PaginatePosition } from '../src/components/dataView/_components/display/Paginate'
import { getLeafKeys } from '../src/utils'

const meta: Meta = {
  title: 'Dataview',
  component: DataView,
}

export default meta

const Template = args => <DataView {...args} />

export const Default = Template.bind({})
Default.args = {
  id: 'voidedLabels',
  minWidth: 1000,
  views: {
    types: {
      table: {
        type: 'basic',
        cols: [
          {
            accessorKey: 'marketplace_id',
            header: 'Marketplace',
            freezable: true,
            style: { width: 150, minWidth: 150 },
          },
          {
            accessorKey: 'label_refund_status',
            header: 'Refund Status',
            style: { width: '100%', minWidth: 450 },
          },
          {
            accessorKey: 'label_tracking_id',
            header: 'Tracking Number',
            style: { width: 150, minWidth: 150 },
          },
          {
            accessorKey: 'shipping_service_name',
            header: 'Service Class',
            style: { width: 150, minWidth: 150 },
          },
          {
            accessorKey: 'package_type',
            header: 'Package Type',
            style: { width: 150, minWidth: 150 },
          },
          // {
          //   accessorKey: '',
          //   header: 'Weight',
          //   style: { width: 150, minWidth: 150 },
          // },
          {
            accessorKey: 'surcharge',
            header: 'Surcharge',
            style: { width: 150, minWidth: 150 },
          },
          // {
          //   accessorKey: '',
          //   header: 'Postmark Date',
          //   style: { width: 150, minWidth: 150 },
          // },
        ],
      },
    },
  },
  display: {
    type: 'paginate',
    position: PaginatePosition.BOTTOM_ONLY,
  },
  settings: {
    initialSettings: {
      limit: 50,
    },
  },
  options: {
    searchable: {
      localSearch: true,
    },
    sortable: {
      localSort: true,
    },
    exportable: true,
    editableColumn: {},
    refreshable: true,
    highlightable: true,
    draggable: true,
    resizable: true,
    editable: {
      label: 'Details',
      onClick: () => {
        alert('asgag')
      },
      // link: '/accounts',
    },
  },
  onFetchData: async () => ({
    totalItems: VOIDED_LABELS_DATA.length,
    columns: getLeafKeys(VOIDED_LABELS_DATA[0]).map((leaf: any) => ({
      label: _.capitalize(leaf.replaceAll('_', ' ').replace('id', '')),
      value: leaf,
    })),
    items: VOIDED_LABELS_DATA,
  }),
}
