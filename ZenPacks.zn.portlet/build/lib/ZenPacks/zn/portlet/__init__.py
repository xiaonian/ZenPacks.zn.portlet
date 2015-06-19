# coding:utf-8
import Globals
import os.path
import re

skinsDir = os.path.join(os.path.dirname(__file__), 'skins')
from Products.CMFCore.DirectoryView import registerDirectory
if os.path.isdir(skinsDir):
    registerDirectory(skinsDir, globals())

from Products.ZenModel.ZenPack import ZenPackBase
from Products.ZenModel.ZenossSecurity import ZEN_COMMON
from Products.ZenUtils.Utils import zenPath

class ZenPack(ZenPackBase):
    """
    Portlet ZenPack class
    """
    def _registerUrlPortlet(self, app):
          zpm = app.zport.ZenPortletManager
          portletsrc = os.path.join(os.path.dirname(__file__), 'UrlPortlet.js')
          p = re.compile(zenPath(''))
          portletsrc = p.sub('', portletsrc)
          zpm.register_portlet(
              sourcepath=portletsrc,
              id='UrlPortlet',
              title='UrlPortlet',
              permission=ZEN_COMMON)


    def install(self, app):
        ZenPackBase.install(self, app)
        self._registerUrlPortlet(app)
    
    def upgrade(self, app):
        ZenPackBase.upgrade(self, app)
        self._registerUrlPortlet(app)
    
    def remove(self, app, leaveObjects=False):
        ZenPackBase.remove(self, app, leaveObjects) 
        zpm = app.zport.ZenPortletManager
        zpm.unregister_portlet('UrlPortlet')
