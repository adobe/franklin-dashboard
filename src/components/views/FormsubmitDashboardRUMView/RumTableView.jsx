import {
  TableView, TableHeader, TableBody, Row, Cell, Column, StatusLight,

  Badge, Text, ProgressBar, ContextualHelp, Content, Heading, IllustratedMessage, Divider, useCollator,
} from '@adobe/react-spectrum';
import './RumTableView.css';
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle';
import AlertCircle from '@spectrum-icons/workflow/AlertCircle';
import CloseCircle from '@spectrum-icons/workflow/CloseCircle';
import SentimentNeutral from '@spectrum-icons/workflow/SentimentNeutral';
import AlertTriangle from '@spectrum-icons/workflow/Alert';
import NotFound from '@spectrum-icons/illustrations/NotFound';

export function RumTableView({
  data, dataFlag, columns, columnHeadings, config, configSetter, setter
}) {

  let collator = useCollator({ numeric: true });
  if (data.length > 0) {
    const ranges = {
      avglcp: [2.5, 4.00],
      avgfid: [100, 300],
      avginp: [200, 500],
      avgcls: [0.1, 0.25],
    };
    const metrics = {
      avglcp: 's',
      avginp: 'ms',
      avgcls: '',
    }

    const sortFunct = ({column, direction}) => {
      let numericColum = parseInt(column.replace(/^\D+/g, ''), 10);
      data.sort((a, b) => {
        let first = a[columns[numericColum]];
        let second = b[columns[numericColum]];
        let cmp = first === null && second === null ? 0 : first === null ? -1 : second === null ? 1 : collator.compare(first*1000, second*1000);
        if (direction === 'descending') {
          cmp *= -1;
        }
        else if(direction === 'ascending') {
          cmp = (first === null || second === null) && direction === 'ascending' ? cmp*-1 : cmp;
        }
        return cmp;
      })
      setter([...data])
    }

    return (
      data.length > 0  && <TableView width="100%" height="100%" alignSelf="end" overflowMode='truncate' selectionMode='multiple' selectionStyle='highlight' density='compact' id='tableview' 
            onSortChange={sortFunct}>
                <TableHeader>
                    {(
                        columns.map((key) => {
                          if (key === 'url') {
                            const hostname = data[0][key] ? new URL(data[0][key].startsWith('https://') ? data[0][key] : `https://${data[0][key]}`).hostname : '';
                            return <Column allowsSorting align="start" width="fit-content" allowsResizing={true}>{`${key} (${hostname})`}</Column>;
                          }
                          if(key !== 'views' && key !== 'submissions') {
                            return (
                              <Column allowsResizing={true} allowsSorting align="center">
                                    <ContextualHelp variant="info">
                                        <Heading>{columnHeadings[key][0]}</Heading>
                                        <Divider size='M'></Divider>
                                        <Content>
                                            <StatusLight variant='positive'>{` Good if <= ${ranges[key][0]}${metrics[key]}`}</StatusLight>
                                            <StatusLight variant='yellow'>{` Okay if > ${ranges[key][0]}${metrics[key]} and <= ${ranges[key][1]}${metrics[key]}`}</StatusLight>
                                            <StatusLight variant='negative'>{` Bad if > ${ranges[key][1]}${metrics[key]}`}</StatusLight>
                                            <Text>{columnHeadings[key][1]}</Text>
                                        </Content>
                                    </ContextualHelp>
                                    <Text>{columnHeadings[key][0]}</Text>
                                </Column>
                          );
                        } else{
                          return (
                            <Column allowsResizing={true} allowsSorting align="center">
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
                        }
                        })
                    )}
                </TableHeader>
                <TableBody>
                    {
                        data.map((rum) => <Row>
                                {(
                                    columns.map((col) => {
                                      if (col === 'url') {
                                        if(rum[col] === 'Other'){
                                          return <Cell>{rum[col]}</Cell>;
                                        }
                                        return <Cell><a href={rum[col]} target="_blank">{rum[col].replace(/^https?:\/\/[^/]+/i, '')}</a></Cell>;
                                      }if (col === 'source') {
                                          return <Cell>{rum[col]}</Cell>;
                                      } if (col.startsWith('avg')) {
                                        const currCol = col === 'avglcp' && rum[col] ? rum[col] / 1000 : rum[col];
                                        const numUpdated = col == 'avginp' ? Math.round(currCol) : currCol;
                                        const numb = parseFloat(numUpdated).toFixed(2).toLocaleString('en-US');
                                        const displayedNumb = numb.endsWith('.00') ? numb.replace('.00', '') : numb;
                                        if (displayedNumb && displayedNumb <= ranges[col][0]) {
                                          return <Cell width='size-1000'>
                                                            <Badge width="size-1000" variant="positive">
                                                                <CheckmarkCircle aria-label="Pass" />
                                                                <Text>{displayedNumb + metrics[col]}</Text>
                                                            </Badge>
                                                        </Cell>;
                                        } if (
                                          displayedNumb > ranges[col][0] && displayedNumb < ranges[col][1]
                                        ) {
                                          return <Cell width='size-1000'>
                                                            <Badge width="size-1000" alignSelf='center' variant='yellow'>
                                                                <AlertTriangle aria-label="Okay" />
                                                                <Text>{displayedNumb + metrics[col]}</Text>
                                                            </Badge>
                                                        </Cell>;
                                        } if (numb === 'NaN') {
                                          return <Cell width='size-1000'>
                                                            <Badge width="size-1000" alignSelf='center' variant='neutral'>
                                                                <SentimentNeutral aria-label="N/A" />
                                                                <Text>N/A</Text>
                                                             </Badge>
                                                        </Cell>;
                                        }
                                        return <Cell width='size-1000'>
                                                            <Badge width="size-1000" alignSelf='center' variant='negative'>
                                                                <CloseCircle aria-label="Fail"></CloseCircle>
                                                                <Text>{displayedNumb + metrics[col]}</Text>
                                                            </Badge>
                                                        </Cell>;
                                      } if (col === 'views') {
                                        return <Cell width='size-1500'>
                                                        <Badge width="size-1500" alignSelf='center' variant='info'>
                                                            <Text width="100%">{parseInt(rum[col], 10).toLocaleString('en-US')}</Text>
                                                        </Badge>
                                                    </Cell>;
                                      }
                                      if (col === 'submissions') {
                                        
                                        return <Cell width='size-1500'>
                                                        <Badge width="size-1500" alignSelf='center' variant='info'>
                                                            <Text width="100%">{parseInt(rum[col], 10).toLocaleString('en-US')}</Text>
                                                        </Badge>
                                                    </Cell>;
                                      }
                                      return <Cell width="size-1000">
                                                    <Badge width="size-1000" alignSelf='center' variant='info'>
                                                        <AlertCircle aria-label="Pass" />
                                                        <Text>{rum[col]}</Text>
                                                    </Badge>
                                                </Cell>;
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