import React from 'react';
import { Box, Container, Card, Paper } from '@material-ui/core';
import { connect } from 'utils';
import DisplayContent from './DisplayContent';
import SidebarContent from './SidebarContent';

function Retail({ store: { retail: retailStore } }) {
  const handleClickMenuItem = (item) => {
    retailStore.setActiveContent({
      title: item,
      body: `fetching ...${item} 
        Eu velit Lorem non amet voluptate nisi veniam incididunt minim aute sit.
        Sunt aliquip aliqua elit eiusmod voluptate. Officia nostrud aute est
        exercitation. In qui quis id reprehenderit qui consequat velit sit id
        voluptate cillum ut veniam. Consectetur mollit duis sint reprehenderit
        consequat fugiat. Excepteur adipisicing tempor ullamco do ex ex officia
        deserunt ea aliqua non consequat aliquip. Exercitation adipisicing minim
        veniam velit nulla esse tempor proident labore ex consectetur. Voluptate
        ipsum aute minim duis consequat nulla aliquip est aliquip dolor
        cupidatat magna commodo. Nostrud ad aute non sint. Duis pariatur ad
        incididunt ipsum. Ullamco consequat quis Lorem ullamco pariatur. Nisi
        commodo mollit eu dolor Lorem commodo velit amet tempor laboris est ut
        laboris est. Quis quis id fugiat magna sit magna reprehenderit ut
        incididunt do deserunt mollit labore. Reprehenderit veniam magna
        consequat id sunt tempor ad nostrud elit laborum fugiat nostrud. Ea
        culpa excepteur ipsum exercitation nostrud laboris fugiat magna aute do.
        Ut ullamco excepteur dolore Lorem irure officia culpa eiusmod nostrud.
        Mollit quis est qui commodo laboris consectetur cupidatat aliquip
        aliqua. Ex deserunt dolore et enim id tempor deserunt ipsum qui deserunt
        sint aliquip. Aliqua laborum dolore consequat cillum amet qui culpa sint
        est Lorem ad nostrud deserunt. Veniam et Lorem ea exercitation. Enim
        ullamco ex cillum id et veniam laboris ullamco aute esse Lorem in.
        Reprehenderit et ea dolor voluptate ullamco ex voluptate fugiat eiusmod
        mollit. Exercitation commodo aute non pariatur sunt in. Fugiat nostrud
        adipisicing cupidatat amet cillum voluptate laborum ea fugiat dolor
        laborum adipisicing. Deserunt elit nisi anim velit. Eiusmod ipsum
        reprehenderit magna Lorem. Deserunt ullamco aliquip eu irure nisi
        excepteur esse aliquip. Proident sunt commodo incididunt nisi ea ut
        voluptate est excepteur aliqua in nisi minim quis. Enim tempor non
        reprehenderit in ipsum reprehenderit quis aute aliquip voluptate ipsum
        sint anim in. Do ut anim in id. Eiusmod in reprehenderit adipisicing
        excepteur ea. Anim id non et veniam laboris anim voluptate. Aliqua
        tempor amet incididunt ut amet deserunt ea duis culpa reprehenderit sunt
        consequat id irure. Et nulla culpa sunt mollit mollit reprehenderit
        mollit dolore excepteur tempor labore enim excepteur eu. Officia in anim
        fugiat cupidatat. Mollit laboris adipisicing exercitation adipisicing
        voluptate non dolor ea deserunt sint laboris ullamco ea. Fugiat cillum
        tempor incididunt elit nostrud nulla tempor nostrud incididunt minim
        quis. Nulla proident ut sint laboris. Amet consequat ea id amet
        cupidatat ea velit culpa sunt. Amet esse in velit nostrud. Consectetur
        quis laborum cupidatat consequat qui ipsum ex ipsum laborum esse magna
        magna. Irure dolore nisi Lorem incididunt in tempor. Dolore
        reprehenderit eu nisi consectetur.`,
    });
  };

  return (
    <Container maxWidth="xl">
      <Box margin={1}>
        <Paper>
          <Box display="flex" height="84vh">
            <Box flex={1} bgcolor="#eeefff" overflow="auto">
              <SidebarContent
                onClick={handleClickMenuItem}
                selected={
                  retailStore.activeContent && retailStore.activeContent.title
                }
              />
            </Box>
            <Box flex={3} overflow="auto">
              <DisplayContent content={retailStore.activeContent} />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default connect('store')(Retail);
