import { SecretVaultWrapper } from '../SecretVault/wrapper.js';
import { orgConfig } from './orgConfig.js';
import { v4 as uuidv4 } from 'uuid';

const SCHEMA_ID = 'a5de8f53-821a-48a7-9a42-f31cbb7c71f0';

// $allot signals that the value will be encrypted to one $share per node before writing to the collection
const web3ExperienceSurveyData = [
  {
    _id: uuidv4(),
    years_in_web3: { $allot: 4 },
    responses: [
      { rating: 5, question_number: 1 },
      { rating: 3, question_number: 2 },
    ],
  },
  {
    _id: uuidv4(),
    years_in_web3: { $allot: 1 },
    responses: [
      { rating: 2, question_number: 1 },
      { rating: 4, question_number: 2 },
    ],
  },
];

async function main() {
  try {
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      SCHEMA_ID
    );
    await collection.init();

    const dataWritten = await collection.writeToNodes(web3ExperienceSurveyData);

    console.log('📚 Data written:', dataWritten[0].result.errors);

    const newIds = [
      ...new Set(dataWritten.map((item) => item.result.data.created).flat()),
    ];
    console.log('created ids:', newIds);

    const dataRead = await collection.readFromNodes({});
    console.log(
      '📚 Data read first 3 records from nodes:',
      dataRead.slice(0, 3)
    );
  } catch (error) {
    console.error('❌ Failed to use SecretVaultWrapper:', error.message);
    process.exit(1);
  }
}

main();
