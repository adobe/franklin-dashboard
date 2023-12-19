import {
    TableView, TableHeader, TableBody, Row, Cell, Column,
  
    Badge, Text, ProgressBar, ContextualHelp, Content, Heading, IllustratedMessage, Divider, Button,
  } from '@adobe/react-spectrum';
  import './Dashboard404TableView.css';
  import NotFound from '@spectrum-icons/illustrations/NotFound';
  import { useStore } from 'stores/global';
  
  export function RumTableView({
    data, dataFlag, columns, columnHeadings
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
                              return <Column align="start" width="fit-content" allowsResizing={true}>{`${key} (${hostname})`}</Column>;
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
                          data.map((rum) => <Row>
                                  {(
                                      columns.map((col) => {
                                        if (col === 'topurl') {
                                          return <Cell><a href={rum[col]} target="_blank">{rum[col].replace(/^https?:\/\/[^/]+/i, '')}</a></Cell>;
                                        }
                                        if (col === 'source') {
                                            if(rum[col].startsWith('https://')){
                                                return <Cell><a href={rum[col]} target="_blank">{rum[col].replace(/^https?:\/\/[^/]+/i, '')}</a></Cell>
                                            }
                                            return <Cell>{rum[col].replace(/^https?:\/\/[^/]+/i, '')}</Cell>;
                                          }
                                        return (
                                        <Cell width="size-1000">
                                            <Badge width="size-1000" alignSelf='center' variant='info'>
                                                <Text>{rum[col]}</Text>
                                            </Badge>
                                        </Cell>
                                        );
                                      })
                                  )}
                              </Row>
                            )
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
  