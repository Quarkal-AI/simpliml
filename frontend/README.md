# Frontend

### Built With

- [Next.js](https://nextjs.org/)

## Getting Started
To get a local copy up and running, please follow these simple steps.

### Prerequisites

Here is what you need to be able to run simpliml locally

- Node.js (Version: >=20.x)

## Project Directory Structure

```
├── Dockerfile
├── README.md
├── lint-staged.config.js
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── public
├── src
│   ├── API
│   │   └── API.ts
│   ├── app
│   │   ├── deployment
│   │   │   ├── _components
│   │   │   │   ├── EditModalForm.tsx
│   │   │   │   ├── ModalForm.tsx
│   │   │   │   ├── ModelDashboard.tsx
│   │   │   │   ├── ReviewDeployDetails.tsx
│   │   │   │   ├── SelectDeployDetails.tsx
│   │   │   │   └── SelectPlatform.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── finetuning
│   │   │   ├── _components
│   │   │   │   ├── DeployForm.tsx
│   │   │   │   ├── FormElement.tsx
│   │   │   │   ├── FormPage1.tsx
│   │   │   │   ├── FormPage2.tsx
│   │   │   │   ├── FormPage4.tsx
│   │   │   │   ├── ModalForm.tsx
│   │   │   │   ├── Pills.tsx
│   │   │   │   └── Popup.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── icon.ico
│   │   ├── layout.tsx
│   │   ├── logs
│   │   │   ├── _components
│   │   │   │   └── DetailedSideBar.tsx
│   │   │   ├── dropdown.css
│   │   │   ├── index.d.ts
│   │   │   └── page.tsx
│   │   ├── model
│   │   │   └── [model_id]
│   │   │       ├── _components
│   │   │       │   ├── Advanceoptions.tsx
│   │   │       │   ├── Docs
│   │   │       │   │   └── Docs.tsx
│   │   │       │   ├── Frequencyandmirostat.tsx
│   │   │       │   ├── Heading.tsx
│   │   │       │   ├── Mirostat.tsx
│   │   │       │   ├── Output.tsx
│   │   │       │   ├── Outputloader.tsx
│   │   │       │   ├── Prompt.tsx
│   │   │       │   ├── Run.tsx
│   │   │       │   ├── Subheading.tsx
│   │   │       │   ├── Textarea.tsx
│   │   │       │   └── Train.tsx
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── page.tsx
│   │   ├── promptstore
│   │   │   ├── _components
│   │   │   │   ├── Chats.tsx
│   │   │   │   ├── DeleteModalFrom.tsx
│   │   │   │   ├── ModelSettings.tsx
│   │   │   │   ├── PromptCard.tsx
│   │   │   │   ├── Prompts.tsx
│   │   │   │   ├── Store.tsx
│   │   │   │   └── UserPromptInput.tsx
│   │   │   ├── create
│   │   │   │   ├── index.d.ts
│   │   │   │   └── page.tsx
│   │   │   ├── edit
│   │   │   │   └── [prompt_id]
│   │   │   │       └── page.tsx
│   │   │   ├── index.d.ts
│   │   │   └── page.tsx
│   │   └── settings
│   │       ├── _components
│   │       │   └── ApiKeySettings.tsx
│   │       ├── layout.tsx
│   │       └── page.tsx
│   ├── components
│   │   ├── Background.tsx
│   │   ├── Button
│   │   │   ├── Button.tsx
│   │   │   └── CustomizableButton.tsx
│   │   ├── DeleteModalPopup.tsx
│   │   ├── FormElement.tsx
│   │   ├── Hashtag.tsx
│   │   ├── HashtagPositionAbsolute.tsx
│   │   ├── HashtagPositionFixed.tsx
│   │   ├── Loader.tsx
│   │   ├── Model.tsx
│   │   ├── MultiSelectDropdown.tsx
│   │   ├── OuterNavbar.tsx
│   │   ├── Pagination.tsx
│   │   ├── Paginations.tsx
│   │   ├── Popup.tsx
│   │   ├── Row.tsx
│   │   ├── Searchbar.tsx
│   │   ├── Searchbars.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SingleSelectionDropdown.tsx
│   │   └── Table.tsx
│   ├── data
│   │   └── apidocs.ts
│   ├── styles
│   │   ├── Collection.module.css
│   │   ├── Explore
│   │   │   ├── Docs
│   │   │   │   └── Docs.module.css
│   │   │   └── Explore.module.css
│   │   ├── Explore.module.css
│   │   ├── Finetuning
│   │   │   └── Finetuning.module.css
│   │   ├── Loader
│   │   │   └── Loader.module.css
│   │   ├── Logs
│   │   │   └── DetailedSideBar.module.css
│   │   ├── Model.module.css
│   │   ├── Models
│   │   │   └── Models.modules.css
│   │   ├── Pagination.module.css
│   │   ├── Prompt
│   │   │   └── Prompt.module.css
│   │   ├── Sandbox
│   │   │   └── Confirmyouremail.module.css
│   │   └── Signup
│   │       └── Signup.module.css
│   ├── types
│   │   └── index.d.ts
│   └── utils
│       ├── RecoilContextProvider.tsx
│       ├── atoms.ts
│       ├── errorHandler.ts
│       ├── socket.ts
│       └── usePills.tsx
├── tailwind.config.ts
└── tsconfig.json
```

## Development

### Setup

1. Clone this repo or [fork](https://github.com/quarkal-ai/simpliml/fork).

```bash
git clone https://github.com/quarkal-ai/simpliml
```

2. Go to the project folder

```bash
cd frontend
```

3. Install packages with npm
```bash
npm install
```

4. Run Development Server
```bash
npm run dev
```
Your development server will be running at http://localhost:3001