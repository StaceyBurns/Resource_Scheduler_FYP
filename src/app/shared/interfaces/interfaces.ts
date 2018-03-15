export class Resource {
    name: string;
    note: string;
  }

  export class ResourceId extends Resource {
    id:string;
  }

  export class Group {
    name: string;
    note: string;
  }

  export class GroupId extends Resource {
    id:string;
  }