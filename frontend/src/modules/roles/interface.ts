export interface Role {
    id?: string;
    name: string;
    description: string;
    composite: boolean;
    clientRole: boolean;
    containerId: string;
    attributes: any;
}

export interface IAttribute {
    key: string;
    value: {
        create: boolean;
        read: boolean;
        update: boolean;
        delete: boolean;
    };
}
