import { ColabList } from './components/ColabList';
import { colaboradores } from './config/colaboradores';  
import { useState } from 'react';

function App() {

    const [users, setUsers] = useState(colaboradores)
 
  return (
    <>
        <ColabList users={users} setUsers={setUsers} />
    </>


  );
}

export default App;
