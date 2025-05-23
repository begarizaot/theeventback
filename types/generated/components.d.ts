import type { Schema, Struct } from '@strapi/strapi';

export interface LayoutFooter extends Struct.ComponentSchema {
  collectionName: 'components_layout_footers';
  info: {
    description: '';
    displayName: 'Footer';
  };
  attributes: {
    logo: Schema.Attribute.Component<'shared.logo-link', false>;
    navItems: Schema.Attribute.Component<'shared.link', true>;
    socialLinks: Schema.Attribute.Component<'shared.logo-link', true>;
    text: Schema.Attribute.String;
  };
}

export interface LayoutHeader extends Struct.ComponentSchema {
  collectionName: 'components_layout_headers';
  info: {
    description: '';
    displayName: 'Header';
  };
  attributes: {
    logo: Schema.Attribute.Component<'shared.logo-link', false>;
    navItems: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface LayoutMenuAdmin extends Struct.ComponentSchema {
  collectionName: 'components_layout_menu_admins';
  info: {
    description: '';
    displayName: 'MenuAdmin';
  };
  attributes: {
    menu: Schema.Attribute.Component<'shared.menu-admin', false>;
    menuItems: Schema.Attribute.Component<'shared.menu-admin', true>;
  };
}

export interface SharedCategory extends Struct.ComponentSchema {
  collectionName: 'components_shared_categories';
  info: {
    displayName: 'Category';
  };
  attributes: {
    category_id: Schema.Attribute.Relation<
      'oneToOne',
      'api::category.category'
    >;
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
  };
}

export interface SharedColor extends Struct.ComponentSchema {
  collectionName: 'components_shared_colors';
  info: {
    displayName: 'Color';
  };
  attributes: {
    color: Schema.Attribute.String;
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    label: Schema.Attribute.String;
  };
}

export interface SharedEvents extends Struct.ComponentSchema {
  collectionName: 'components_shared_events';
  info: {
    description: '';
    displayName: 'EventsCarrusel';
  };
  attributes: {
    btn: Schema.Attribute.Component<'shared.link', false>;
    description: Schema.Attribute.Blocks;
    event_id: Schema.Attribute.Relation<'oneToOne', 'api::event.event'>;
    isVisible: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    description: '';
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String;
    isButtonLink: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    isLogin: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
  };
}

export interface SharedLogoLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_logo_links';
  info: {
    displayName: 'LogoLink';
  };
  attributes: {
    href: Schema.Attribute.String;
    isExternal: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String;
    urlImage: Schema.Attribute.String;
  };
}

export interface SharedMenuAdmin extends Struct.ComponentSchema {
  collectionName: 'components_shared_menu_admins';
  info: {
    displayName: 'MenuAdmin';
  };
  attributes: {
    icon: Schema.Attribute.String;
    isAll: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    name: Schema.Attribute.String;
    path: Schema.Attribute.String;
    type_roles_ids: Schema.Attribute.Relation<
      'oneToMany',
      'api::team-type-role.team-type-role'
    >;
  };
}

export interface SharedMeta extends Struct.ComponentSchema {
  collectionName: 'components_shared_metas';
  info: {
    description: '';
    displayName: 'Meta';
  };
  attributes: {
    description: Schema.Attribute.Text;
    keywords: Schema.Attribute.String;
    site_name: Schema.Attribute.String;
    title: Schema.Attribute.String;
    urlImage: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'layout.footer': LayoutFooter;
      'layout.header': LayoutHeader;
      'layout.menu-admin': LayoutMenuAdmin;
      'shared.category': SharedCategory;
      'shared.color': SharedColor;
      'shared.events': SharedEvents;
      'shared.link': SharedLink;
      'shared.logo-link': SharedLogoLink;
      'shared.menu-admin': SharedMenuAdmin;
      'shared.meta': SharedMeta;
    }
  }
}
