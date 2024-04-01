/* eslint-disable no-unused-vars */
import {
  TableView, TableHeader, TableBody, Row, Cell, Column,
  Badge, Text, ProgressBar, ContextualHelp, Content, Heading, IllustratedMessage, Divider, Button,
} from '@adobe/react-spectrum';
import './Dashboard404TableView.css';
// eslint-disable-next-line import/extensions
import NotFound from '@spectrum-icons/illustrations/NotFound';

// eslint-disable-next-line import/prefer-default-export
export function RumTableView({
  data, dataFlag, columns, columnHeadings,
}) {
  if (data.length > 0) {
    return (
      data.length > 0
              && <TableView width="100%" height="100%" alignSelf="end" overflowMode='truncate' selectionMode='multiple' selectionStyle='highlight' density='compact' id='tableview404'>
                  <TableHeader>
                    {(
                      columns.map((key) => {
                        if (key === 'url') {
                          const hostname = data[0][key] ? new URL(data[0][key].startsWith('https://') ? data[0][key] : `https://${data[0][key]}`).hostname : '';
                          return <Column align="start" width="fit-content" allowsResizing={true}>{`URL (${hostname})`}</Column>;
                        }
                        return (
                          <Column align="start">
                              <ContextualHelp variant="info">
                                  <Heading>{columnHeadings[key][0]}</Heading>
                                  <Divider size='M'></Divider>
                                  <Content>
                                      <Text>{columnHeadings[key][1]}</Text>
                                  </Content>
                              </ContextualHelp>
                              <Text>{columnHeadings[key][0]}</Text>
                          </Column>
                        );
                      })
                    )}
                  </TableHeader>
                  <TableBody>
                      {
                          data.map((rum, idx) => <Row key={idx} width="100%" height="size-1000" >
                              {(
                                columns.map((col) => {
                                  if (col === 'url') {
                                    return <Cell><a href={rum[col]} target="_blank">{rum[col]}</a></Cell>;
                                  }
                                  if (col === 'top_source') {
                                    if (rum[col].startsWith('https://')) {
                                      return <Cell><a href={rum[col]} target="_blank">{rum[col]}</a></Cell>;
                                    }
                                    return <Cell>{rum[col]}</Cell>;
                                  }
                                  return (
                                  <Cell width="size-1000">
                                      <Badge width="size-1000" alignSelf='center' variant='info'>
                                          <Text>{parseInt(rum[col], 10).toLocaleString('en-US')}</Text>
                                      </Badge>
                                  </Cell>
                                  );
                                })
                              )}
                            </Row>)
                      }
                  </TableBody>
              </TableView>
    );
  } if (dataFlag) {
    return (
      <ProgressBar margin="auto" label="Loading…" isIndeterminate />
    );
  }
  return (
    <IllustratedMessage margin="auto">
        <NotFound />
        <Heading>No results</Heading>
        <Content>Use Filters</Content>
    </IllustratedMessage>
  );
}
