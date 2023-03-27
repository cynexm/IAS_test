import React from 'react'
import { TextField, Link } from 'react-admin'

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation()

export const LinkedField = ({ source, record, displayText, resourceName, ...props }: any) => {
  return (
    <Link color="primary" onClick={stopPropagation} to={`/${resourceName}/${record[source]}/show`}>
      <TextField style={{ color: '#ffc107' }} source={displayText} record={record} {...props} />
    </Link>
  )
}
