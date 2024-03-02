import React from 'react'
import { Tabs as ChakraTabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

const Tabs = ({ titles, panels, variant }) => {
    return (
        <ChakraTabs isFitted variant={variant}>
            <TabList mb='1em'>
                {
                    titles.map((title, index) => (
                        <Tab key={index} fontWeight='semibold'>{title}</Tab>
                    ))
                }
            </TabList>
            <TabPanels>
                {
                    panels.map((panel, index) => (
                        <TabPanel key={index}>
                            {panel}
                        </TabPanel>
                    ))
                }
            </TabPanels>
        </ChakraTabs>
    )
}

export default Tabs;